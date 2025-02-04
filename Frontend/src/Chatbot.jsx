import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faPaperPlane, faTimesCircle, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import { useRef, useState, useEffect } from "react";
import { BotMessageBubble, UserInputBubble } from "./MessageBubble";
import axios from "axios";
import { useUser } from "./Context";

export default function ChatBot() {
  const imageUploadRef = useRef(null);
  const messageEndRef = useRef(null);
  const { userInfo, userId } = useUser();

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAPICall = async () => {
    if (query.trim() === "") return;
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "user", message: query, image: imageUrl },
      ]);

      if (image && query) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("user_id", `${userId} The user info is ${JSON.stringify(userInfo)}`);
        formData.append("message", query);
        formData.append("language", language);

        setImage(null);
        setImageUrl(null);
        setQuery("");

        const response = await axios.post("https://sterling-python-willingly.ngrok-free.app/chat", formData);
        if (response.status === 200) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "bot", message: response.data.response },
          ]);
          return;
        }
      }

      if (query) {
        const tempObj = {
          user_id: userId,
          message: `${query} The user info is ${JSON.stringify(userInfo)}`,
          language,
        };

        setQuery("");
        const response = await axios.post("https://sterling-python-willingly.ngrok-free.app/message", tempObj);
        if (response.status === 200) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "bot", message: response.data.response },
          ]);
        }
      }
    } catch (e) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "bot", message: "Something went wrong. Please try again." },
      ]);
      console.error(e);
    }
  };

  const handleSpeak = () => {
    const audioButton = document.querySelector("#audio-button");
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      if (audioButton) {
        audioButton.style.color = "inherit";
      }
      return;
    }

    const lastBotMessage = [...messages].reverse().find((msg) => msg.user === "bot")?.message;

    if (lastBotMessage) {
      speechSynthesis.cancel();

      const maxChunkLength = 200;
      const textChunks = lastBotMessage.match(new RegExp(`.{1,${maxChunkLength}}`, "g"));

      if (audioButton) {
        audioButton.style.color = "blue";
      }

      let index = 0;

      const speakNextChunk = () => {
        if (index < textChunks.length) {
          const utterance = new SpeechSynthesisUtterance(textChunks[index]);

          utterance.lang = language === "ta" ? "ta-IN" : "en-US";

          const voices = speechSynthesis.getVoices();
          const selectedVoice = voices.find((voice) => voice.lang === utterance.lang);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          } else {
            console.error(`Tamil voice ("ta-IN") not available. Defaulting to another voice.`);
          }

          utterance.onend = () => {
            index++;
            speakNextChunk();
          };

          speechSynthesis.speak(utterance);
        } else {
          if (audioButton) {
            audioButton.style.color = "inherit";
          }
        }
      };

      speakNextChunk();
    }
  };

  return (
    <>
      <div className="flex h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="flex flex-col px-4 justify-between w-full h-full">
          <div className="flex flex-row m-1 justify-end ">
            <div className="flex flex-col items-center">


              {/* Radio buttons for language selection */}
              <div className="flex space-x-4">
                <label className="text-neutral-300 font-semibold flex items-center space-x-2">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={language === "en"}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-neutral-300"
                  />
                  <span className="text-neutral-200"><b>English</b></span>
                </label>

                <label className="text-neutral-300 font-semibold flex items-center space-x-2">
                  <input
                    type="radio"
                    name="language"
                    value="ta"
                    checked={language === "ta"}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-neutral-300"
                  />
                  <span className="text-neutral-200"><b>தமிழ்</b></span>
                </label>
              </div>
            </div>

          </div>
          <div className="flex flex-col overflow-y-auto mb-3 mt-1">
            {messages.map((val, index) => (
              <>
                {val.user === "user" && <UserInputBubble key={index} user={val} />}
                {val.user === "bot" && <BotMessageBubble key={index} bot={val} />}
              </>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <div className="p-2 bg-neutral-500 rounded-lg my-4">
            {imageUrl && (
              <div className="relative  inline-block">
                <img className="w-50 h-40" src={imageUrl} alt="Image" />
                <FontAwesomeIcon
                  onClick={() => {
                    setImage(null);
                    setImageUrl(null);
                  }}
                  icon={faTimesCircle}
                  color="red"
                  className="absolute top-0 right-0"
                />
              </div>
            )}
            <div className="flex items-center justify-between bg-neutral-500 rounded-lg bg-purple-100">
              <input
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                placeholder="Enter some Query"
                className="w-full py-2 px-4 rounded focus:outline-none bg-purple-200 placeholder-neutral-950 font-mono"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAPICall();
                }}
              />

              <div className="flex flex-row mx-5 space-x-5">
                <button id="audio-button" onClick={handleSpeak}>
                  <FontAwesomeIcon icon={faVolumeUp} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  onChange={handleImageUpload}
                  ref={imageUploadRef}
                />
                <button>
                  <FontAwesomeIcon icon={faUpload} onClick={() => imageUploadRef.current.click()} />
                </button>
                <button onClick={handleAPICall}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
