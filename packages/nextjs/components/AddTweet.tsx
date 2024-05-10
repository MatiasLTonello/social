import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AddTweet = () => {
  // Estado local para almacenar el contenido del tweet
  const [tweetContent, setTweetContent] = useState("");
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");
  const [loading, setLoading] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Llamar a la función para crear el tweet con el contenido actual
    try {
      await writeYourContractAsync({
        functionName: "createTweet",
        args: [tweetContent],
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
    setTweetContent("");
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form id="tweetForm" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <textarea
            id="tweetContent"
            placeholder="What's happening?"
            value={tweetContent}
            onChange={e => setTweetContent(e.target.value)}
            className="w-full p-2 border bg-base-200 border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <br />
          <div className="flex justify-center">
            {loading ? (
              <button className="btn btn-square">
                <span className="loading loading-spinner"></span>
              </button>
            ) : (
              <button
                type="submit"
                id="tweetSubmitBtn"
                disabled={!tweetContent} // Deshabilitar el botón si el contenido del tweet está vacío
                className={`btn py-2 px-4 bg-base-200 text-white rounded focus:outline-none ${
                  !tweetContent ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {"Tweet"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTweet;
