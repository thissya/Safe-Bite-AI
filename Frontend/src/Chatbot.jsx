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
    
      // Check if speech synthesis is already speaking
      if (speechSynthesis.speaking) {
        // If so, cancel it
        speechSynthesis.cancel();
    
        // Change the color of the audio icon back to default
        if (audioButton) {
          audioButton.style.color = "inherit";
        }
        return; // Exit the function if speech is canceled
      }
    
      // Find the last bot message without reversing the messages array
      const lastBotMessage = [...messages].reverse().find((msg) => msg.user === "bot")?.message;
    
      if (lastBotMessage) {
        // Cancel any ongoing speech synthesis before starting a new one
        speechSynthesis.cancel();
    
        // Split the message into smaller chunks if it's too long
        const maxChunkLength = 200; // Define a reasonable chunk size
        const textChunks = lastBotMessage.match(new RegExp(`.{1,${maxChunkLength}}`, "g"));
    
        // Change the color of the audio icon while speaking
        if (audioButton) {
          audioButton.style.color = "blue";
        }
    
        let index = 0;
    
        const speakNextChunk = () => {
          if (index < textChunks.length) {
            const utterance = new SpeechSynthesisUtterance(textChunks[index]);
    
            // Set the language dynamically based on the selected option
            utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    
            // Ensure the browser selects the correct voice for Tamil
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find((voice) => voice.lang === utterance.lang);
            if (selectedVoice) {
              utterance.voice = selectedVoice;
            } else {
              console.error(`Tamil voice ("ta-IN") not available. Defaulting to another voice.`);
            }
    
            utterance.onend = () => {
              index++;
              speakNextChunk(); // Continue to the next chunk
            };
    
            speechSynthesis.speak(utterance);
          } else {
            // Reset the icon color once all chunks are spoken
            if (audioButton) {
              audioButton.style.color = "inherit";
            }
          }
        };
    
        speakNextChunk(); // Start speaking the first chunk
      }
    };

    return (
      <>
        <div className="flex bg-slate-300 h-screen w-screen">
          <Navbar />
          <div className="flex flex-col px-4 justify-between w-full h-full">
            <div className="flex flex-row m-1 justify-end ">
              <div className="flex flex-col items-center">
                <h1 className="text-black"><b>Language</b></h1>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="py-2 px-4 border rounded"
                >
                  <option value="en"><b>English</b></option>
                  <option value="ta"><b>தமிழ்</b></option>
                </select>
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
            <div className="p-2 bg-white rounded-lg my-4">
              {imageUrl && (
                <div className="relative inline-block">
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
              <div className="flex items-center justify-between bg-white rounded-lg shadow-gray-50">
                <input
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  placeholder="Enter some query"
                  className="w-full py-2 px-4 rounded focus:outline-none"
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
