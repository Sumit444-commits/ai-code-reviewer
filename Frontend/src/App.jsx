import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useState } from "react";

// Add language support for prism
import "prismjs/components/prism-javascript";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {\n  return a + b;\n}`);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/ai/get-review`, {
        code,
      });
      setReview(response.data);
    } catch (error) {
      console.error(error);
      setReview("### Error\nFailed to fetch review. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added h-screen to ensure it takes full height of the browser
    <main className="w-full h-screen bg-[#1a1a1a]">
      <h1 className="pt-6 px-6 text-[light-dark(#ffffff,#000000)]">Code Reviewer</h1>
      <div className="w-full h-[90%] flex gap-4 p-6 bg-[#1a1a1a]">
       
      {/* Left: Code Editor Section */}
      <div className="h-full basis-1/2 rounded-xl bg-[#0c0c0c] relative flex flex-col border border-gray-700">
        <div className="w-full h-full overflow-auto p-2">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={15}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              minHeight: "100%",
            }}
          />
        </div>
        
        {/* Review Button */}
        <button
          onClick={reviewCode}
          disabled={loading}
          className={`absolute bottom-6 right-6 py-2 px-8 rounded-lg font-medium select-none transition-all ${
            loading 
            ? "bg-gray-500 cursor-not-allowed" 
            : "bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
          }`}
        >
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>

      {/* Right: AI Review Section */}
      <div className="h-full basis-1/2 rounded-xl bg-[#252525] px-8 py-6 text-gray-200 overflow-auto border border-gray-700 prose prose-invert max-w-none">
        {review ? (
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Click "Review" to see AI feedback...
          </div>
        )}
      </div>

       
      </div>
    </main>
  );
}

export default App;