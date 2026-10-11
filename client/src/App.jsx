
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import UrlHistory from "./components/UrlHistory";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter your URL");
      return;
    }

    setLoading(true);
    setShortUrl("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/shorturl",
        {
          Originalurl: url.trim(),
        }
      );

      setShortUrl(response.data.Shorturl);
      toast.success("Short URL created successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create short URL. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Unable to copy the link");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-sans font-bold">
          Tiny<span className="text-orange-500">URL</span>
        </h1>

        <p className="mt-4 text-gray-600">
          Turn long URLs into short links.
        </p>

        <form onSubmit={handleClick} className="mt-8">
          <input
            type="url"
            className="w-full border p-3 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-orange-500 px-4 py-3 text-white rounded-lg w-full font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Shorten URL"}
          </button>
        </form>

        {shortUrl ? (
          <div className="mt-8 border rounded-xl p-5">
            <p className="text-gray-600 text-sm mb-3">
              Your shortened link
            </p>

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 underline break-all"
            >
              {shortUrl}
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 block w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Copy Link
            </button>
          </div>
        ) : (
          <p className="mt-6 text-gray-400 text-sm">
            Your shortened link will appear here.
          </p>
        )}
        <UrlHistory />
      </div>

      

      <ToastContainer position="top-right" />
    </div>
  );
};

export default App;
