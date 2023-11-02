import {
  type Authorization,
  AuthorizationContext,
  CoinOpContext,
} from "coinopreact";
import dynamic from "next/dynamic";
import { type ReactElement, useContext, useEffect, useState } from "react";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const CoinOp = useContext(CoinOpContext);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signIn, signOut, auth } = useContext(AuthorizationContext);
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
        <div className="mx-auto flex max-w-sm items-center space-x-4 rounded-xl bg-gray-900 p-6 shadow-md">
          <div className="flex-shrink-0">
            <WalletMultiButtonDynamic />
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signOut()}
              className="w-full rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Sign Out
            </button>
            <button
              onClick={() => signIn(CoinOp.wallet, "")}
              className="w-full rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              Sign In
            </button>
            {
              <div>
                {isClient && auth ? (
                  <p>You are signed in.</p>
                ) : (
                  <p>You are signed out.</p>
                )}
              </div>
            }

            <button
              onClick={() => CoinOp.initCoinOp(0.05, "H", auth!)}
              className="w-full rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
            >
              Init CoinOp
            </button>
            <button
              onClick={() =>
                CoinOp.processCoinOp(
                  CoinOp.currentCoinOp?.payload.coinOp.id ??
                    prompt("CoinOp ID") ??
                    "",
                  auth!,
                )
              }
              className="w-full rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
            >
              Process CoinOp
            </button>
            <button
              onClick={() =>
                CoinOp.finalizeCoinOp(
                  CoinOp.currentCoinOp?.payload.coinOp.id ??
                    prompt("CoinOp ID") ??
                    "",
                  auth!,
                )
              }
              className="w-full rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
            >
              Finalize CoinOp
            </button>
            <button
              onClick={() => CoinOp.recoverCoinOp(auth!)}
              className="w-full rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
            >
              Recover CoinOp
            </button>
            <button
              onClick={() => console.log(CoinOp)}
              className="w-full rounded bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
            >
              Log CoinOp
            </button>
            <button
              onClick={() => console.log(auth)}
              className="w-full rounded bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
            >
              Log Auth
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-sm rounded-xl bg-gray-900 p-6 shadow-md">
          {CoinOp.currentCoinOp ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">
                <span>ID: {CoinOp.currentCoinOp.payload.coinOp.id}</span>
              </div>
              <div className="text-sm font-medium">
                <span>
                  Status: {CoinOp.currentCoinOp.payload.coinOp.status}
                </span>
              </div>
              <div className="text-sm font-medium">
                <span>Won: {CoinOp.currentCoinOp.payload.coinOp.won}</span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-medium">
              No current CoinOp. Sign in and init a CoinOp to get started.
            </span>
          )}
        </div>
      </div>
    </>
  );
}
