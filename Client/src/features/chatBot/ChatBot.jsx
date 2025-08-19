import React, { useState } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useFormik } from "formik";
import { axiosInstance } from "../../services/axiosInstance";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hey there, how can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: message }]);
    setLoading(true);

    try {
      const res = await axiosInstance.post("chat-model/query", {
        question: message,
      });

      const botReply = res?.data?.answer || "sorry i couldn't understand that";
      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "something went wrong please try again" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { message: "" },
    onSubmit: (values, { resetForm }) => {
      handleSendMessage(values.message);
      resetForm();
    },
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className=" chatbot-popup flex flex-col bg-white w-[250px] sm:w-[350px] max-w-full shadow-2xl rounded-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div
            className="chat-header flex justify-between items-center p-4 text-white"
            style={{ backgroundColor: "#C69963" }}
          >
            <div className="header-info flex items-center gap-2">
              <TbMessageChatbot
                className="h-9 w-9 p-2 rounded-full bg-gray-50 shadow-md"
                style={{ color: "#C69963" }}
              />
              <h2 className="text-lg font-semibold">Chatbot</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:cursor-pointer bg-gray-50 hover:opacity-80 transition"
              style={{ color: "#C69963" }}
            >
              <MdKeyboardArrowDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-body flex-1 px-4 py-5 space-y-4 overflow-y-auto bg-gray-50 max-h-[400px]">
            {messages.map((msg, i) =>
              msg.type === "bot" ? (
                <div key={i} className="flex items-start gap-3">
                  <TbMessageChatbot
                    className="mt-1"
                    size={22}
                    style={{ color: "#C69963" }}
                  />
                  <div
                    className="px-4 py-2 rounded-lg max-w-[80%] shadow-sm"
                    style={{ backgroundColor: "#F3E9DF", color: "#333" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div
                    className="text-white px-4 py-2 rounded-lg max-w-[80%] shadow-sm"
                    style={{ backgroundColor: "#C69963" }}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            )}
            {loading && (
              <div className="flex items-start gap-3">
                <TbMessageChatbot
                  className="mt-1"
                  size={22}
                  style={{ color: "#C69963" }}
                />
                <div
                  className="px-4 py-2 rounded-lg max-w-[80%] shadow-sm italic"
                  style={{ backgroundColor: "#F3E9DF", color: "#333" }}
                >
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="chat-footer bg-gray-100 border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              type="text"
              name="message"
              placeholder="Type your message..."
              value={formik.values.message}
              onChange={formik.handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  formik.handleSubmit();
                }
              }}
              className="flex-1 p-2 text-sm border text-gray-800 pl-4 border-gray-300 rounded-full focus:outline-none"
              style={{
                boxShadow: `0 0 0 2px transparent`,
              }}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px #C69963`)}
              onBlur={(e) =>
                (e.target.style.boxShadow = `0 0 0 2px transparent`)
              }
            />
            <button
              type="button"
              onClick={formik.handleSubmit}
              className="sm:size-9 flex items-center justify-center rounded-full hover:cursor-pointer text-white hover:opacity-90 transition"
              style={{ backgroundColor: "#C69963" }}
            >
              <MdKeyboardArrowUp size={20} />
            </button>
          </div>
        </div>
      ) : (
        // Floating icon
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full shadow-lg hover:cursor-pointer hover:opacity-90 transition"
          style={{ backgroundColor: "#C69963", color: "white" }}
        >
          <TbMessageChatbot size={28} />
        </button>
      )}
    </div>
  );
}
