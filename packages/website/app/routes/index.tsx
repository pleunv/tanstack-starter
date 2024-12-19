import * as fs from 'node:fs';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

const filePath = 'count.txt';

async function readCount() {
  return Number.parseInt(await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'));
}

const getCount = createServerFn({
  method: 'GET'
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount()
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-200 to-teal-400 transition-colors duration-300">
      <h1 className="mb-8 font-bold text-4xl text-gray-900">Press the button</h1>
      <button
        className="mb-4 cursor-pointer rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-gray-800"
        type="button"
        onClick={() => {
          updateCount({ data: 1 }).then(() => {
            router.invalidate();
          });
        }}
      >
        Add 1
      </button>
      You've clicked {state} times.
    </div>
  );
}
