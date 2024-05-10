import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Tweet {
  author: string; // Dirección Ethereum del autor del tweet
  content: string; // Contenido del tweet
  timestamp: bigint; // Marca de tiempo del tweet (UNIX timestamp)
  likes: bigint; // Número de likes del tweet
  id: any; // Identificador único del tweet
}

interface TweetsProps {
  tweets: readonly Tweet[] | undefined;
}

const Tweets = ({ tweets }: TweetsProps) => {
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const likeTweet = async (tweetId: bigint, author: string) => {
    try {
      await writeYourContractAsync({
        functionName: "likeTweet",
        args: [author, tweetId],
      });
    } catch (e) {
      console.error("Error:", e);
    }
  };

  function getTweetTime(timestamp: bigint): string {
    const utcDate = new Date(Number(timestamp) * 1000); // Convertir el bigint a número y luego a fecha (multiplicando por 1000 ya que el timestamp es en segundos)
    const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  }
  return (
    <div className="w-full">
      {tweets &&
        tweets.map((tweet: Tweet) => (
          <div key={tweet.id} className="chat chat-start bg-base-200 p-4 mb-4 rounded-md shadow-md space-y-2">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="chat-header">
              <p>{tweet.author}</p>
            </div>
            <div className="chat-bubble">{tweet.content}</div>
            <div className="chat-footer w-full opacity-50 flex justify-between">
              <time className="text-xs opacity-50">{getTweetTime(tweet.timestamp)}</time>
              <button className="flex items-center" onClick={() => likeTweet(tweet.id, tweet.author)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>

                <span className="ml-1">{String(tweet.likes)}</span>
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Tweets;
