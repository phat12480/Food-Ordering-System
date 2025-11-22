// src/components/ChatWidget.jsx
import { useState } from "react";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào 👋 Mình là trợ lý AI mini. Mình có thể giúp bạn về món ăn, đơn hàng, hoặc cách dùng website.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Hàm “giả AI”: trả lời đơn giản dựa trên từ khoá
  const generateBotReply = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes("ship") || text.includes("giao")) {
      return "Bên mình hỗ trợ giao đồ ăn trong khoảng 30–45 phút tuỳ khu vực nhé 🚚.";
    }

    if (text.includes("mở cửa") || text.includes("giờ")) {
      return "Hệ thống đặt món online hoạt động 24/7, nhưng thời gian giao hàng phụ thuộc nhà hàng đang mở từ 8:00–22:00 ⏰.";
    }

    if (text.includes("thanh toán") || text.includes("payment")) {
      return "Hiện tại hệ thống demo hỗ trợ thanh toán khi nhận hàng (COD). Bản thật có thể tích hợp Momo, VNPay, v.v.";
    }

    if (
      text.includes("order") ||
      text.includes("đặt") ||
      text.includes("món")
    ) {
      return "Để đặt món, bạn hãy đăng nhập, chọn món ở danh sách, sau đó bấm 'Đặt món này'. Đơn của bạn sẽ được lưu trong hệ thống 📦.";
    }

    if (
      text.includes("lỗi") ||
      text.includes("bug") ||
      text.includes("không được")
    ) {
      return "Nếu bạn gặp lỗi, hãy thử reload trang, kiểm tra lại kết nối mạng, hoặc đăng nhập lại. Nếu vẫn lỗi thì báo lại cho admin nhé 🛠️.";
    }

    return "Mình chưa hiểu câu hỏi lắm 😅 Bạn thử hỏi về: đặt món, giao hàng, thanh toán, hoặc lỗi hệ thống nhé.";
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Giả lập AI “suy nghĩ” 500ms
    setTimeout(() => {
      const reply = generateBotReply(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
        },
      ]);
      setIsThinking(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    // Nút mở chat nổi góc dưới bên phải
    return (
      <button
        onClick={toggleOpen}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          borderRadius: "999px",
          padding: "10px 18px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          zIndex: 9999,
        }}
      >
        💬 Chat AI
      </button>
    );
  }

  // Khung chat mở
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 320,
        height: 420,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9999,
        fontFamily: "system-ui",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          background:
            "linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(59,130,246,1) 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>AI trợ lý đặt món</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>
            Hỏi mình bất cứ điều gì 🧠
          </div>
        </div>
        <button
          onClick={toggleOpen}
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Nội dung chat */}
      <div
        style={{
          flex: 1,
          padding: 8,
          overflowY: "auto",
          backgroundColor: "#f9fafb",
        }}
      >
        {messages.map((m, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "6px 10px",
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.4,
                backgroundColor: m.sender === "user" ? "#2563eb" : "white",
                color: m.sender === "user" ? "white" : "#111827",
                boxShadow:
                  m.sender === "user"
                    ? "0 2px 6px rgba(37,99,235,0.4)"
                    : "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 4,
            }}
          >
            AI đang suy nghĩ...
          </div>
        )}
      </div>

      {/* Ô nhập */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: 8,
          backgroundColor: "#f3f4f6",
        }}
      >
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi của bạn..."
          style={{
            width: "100%",
            resize: "none",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 6,
            fontSize: 13,
            outline: "none",
            marginBottom: 4,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: "100%",
            padding: "6px 10px",
            borderRadius: 8,
            border: "none",
            backgroundColor: input.trim() ? "#2563eb" : "#9ca3af",
            color: "white",
            fontWeight: 600,
            cursor: input.trim() ? "pointer" : "not-allowed",
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatWidget;
