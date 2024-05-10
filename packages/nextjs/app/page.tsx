"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import AddTweet from "~~/components/AddTweet";
import Tweets from "~~/components/Tweets";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: tweets } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getAllTweets",
    args: [connectedAddress],
  });
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">GM2 Social</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="space-y-4">
            <AddTweet />
            <Tweets tweets={tweets} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
