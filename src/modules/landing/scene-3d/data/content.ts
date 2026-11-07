export interface GameContentItem {
  readonly id: string;
  readonly title: string;
  readonly subject: string;
  readonly subjectColor: string;
  readonly control: string;
  readonly description: string;
  readonly learnings: readonly string[];
}

export interface Landing3DContent {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly ctaPlay: string;
    readonly ctaExplore: string;
    readonly scrollHint: string;
  };
  readonly games: readonly GameContentItem[];
  readonly wardrobe: {
    readonly title: string;
    readonly description: string;
    readonly steps: readonly {
      readonly step: string;
      readonly title: string;
      readonly desc: string;
    }[];
    readonly cta: string;
  };
  readonly community: {
    readonly friends: {
      readonly title: string;
      readonly description: string;
    };
    readonly teachers: {
      readonly title: string;
      readonly description: string;
      readonly securityBadge: string;
    };
  };
  readonly finale: {
    readonly title: string;
    readonly subtitle: string;
    readonly ctaPlay: string;
    readonly credit: string;
    readonly copyright: string;
  };
}

export const landing3DContent: Landing3DContent = {
  hero: {
    title: "Dùng kiến thức để chinh phục mọi trò chơi",
    subtitle:
      "Những trò chơi thú vị, tương tác trực tiếp qua camera: bạn cử động trước màn hình, nhân vật làm theo. Vừa chơi vừa hiểu bài, qua màn còn có quà.",
    ctaPlay: "Chơi ngay",
    ctaExplore: "Khám phá",
    scrollHint: "Cuộn để khám phá",
  },
  games: [
    {
      id: "game-nguyen-tu-khoi",
      title: "Con đường hoá học",
      subject: "Hoá học",
      subjectColor: "#2e9a3c",
      control: "🙂 Lắc đầu trái / phải",
      description:
        "Chú chuột Whisker chạy băng băng trên đường rừng. Câu hỏi hiện lên: Natri nặng bao nhiêu? Nghiêng đầu sang trái hoặc phải để lao vào bệ ghi đúng nguyên tử khối. Đúng thì được xu, sai thì rung cả màn hình!",
      learnings: [
        "Nhớ nguyên tử khối các nguyên tố thường gặp",
        "Phản xạ nhanh với ký hiệu nguyên tố",
        "3 bản đồ rừng, biển, thành phố khó dần",
      ],
    },
    {
      id: "game-sau-rieng",
      title: "Cơn mưa sầu riêng",
      subject: "Vật lý",
      subjectColor: "#e3792c",
      control: "✋ Vẫy tay trước camera",
      description:
        "Cả vườn sầu riêng to nhỏ treo cao tới 25 mét, rụng không báo trước! Đưa tay qua lại để dắt Whisker đội thúng chạy tới hứng. Quan sát độ cao và cân nặng để đoán quả nào rơi trước.",
      learnings: [
        "Rơi tự do và thời gian rơi theo độ cao",
        "Vì sao quả nặng rơi nhanh hơn khi có lực cản không khí",
        "Đọc bảng số liệu sau mỗi ván",
      ],
    },
    {
      id: "game-guong-than",
      title: "Cao thủ cân gương",
      subject: "Quang học",
      subjectColor: "#3d7be0",
      control: "🎯 Xoay gương, ngắm và BẮN",
      description:
        "Đấu súng laser với máy tính trong mê cung gương. Không bắn thẳng được đâu: xoay gương, canh góc tới để tia sáng nảy qua tường và trúng đối thủ trước!",
      learnings: [
        "Định luật phản xạ ánh sáng (góc tới bằng góc phản xạ)",
        "Ước lượng góc ngắm",
        "Chiến thuật theo lượt",
      ],
    },
  ],
  wardrobe: {
    title: "Qua màn – nhận xu – mặc đồ lên nhân vật",
    description:
      "Hoàn thành bài học trên 70% là có xu. Đổi vương miện, kính râm, mặt nạ hacker... và mặc lên nhân vật ngay trong trò chơi. Càng chơi tủ đồ càng đầy!",
    steps: [
      {
        step: "01",
        title: "Đăng nhập",
        desc: "1 chạm với Google, xong ngay.",
      },
      {
        step: "02",
        title: "Bật camera & chơi",
        desc: "Lắc đầu, vẫy tay hoặc chuột/chạm.",
      },
      {
        step: "03",
        title: "Nhận quà & khoe",
        desc: "Đổi đồ trong tủ, mặc lên và khoe bạn.",
      },
    ],
    cta: "Chơi để nhận quà",
  },
  community: {
    friends: {
      title: "Chơi cùng bạn bè",
      description:
        "Lập nhóm cùng học, giữ chuỗi ngày học 🔥, thi đua bảng thành tích với cả lớp.",
    },
    teachers: {
      title: "Dành cho thầy cô & phụ huynh",
      description:
        "Kiến thức chính xác, dễ hiểu · Hoàn toàn miễn phí trên trình duyệt · An toàn: AI nhận diện cử chỉ MediaPipe chạy ngay trên máy của học sinh, hình ảnh camera không gửi lên máy chủ và không được lưu lại.",
      securityBadge: "🔒 An toàn cho học sinh",
    },
  },
  finale: {
    title: "Sẵn sàng phiêu lưu cùng Whisker?",
    subtitle: "Miễn phí, chơi ngay trên trình duyệt, không cần cài đặt.",
    ctaPlay: "Chơi ngay",
    credit:
      "Dự án STEAMaze được tài trợ bởi dự án GenAct - Sáng kiến do UN Women Việt Nam phối hợp với TUVA Communication tổ chức, tìm kiếm và hỗ trợ các nhóm thanh niên phát triển các giải pháp số nhằm giải quyết những thách thức về bình đẳng giới, đặc biệt hướng tới phụ nữ và các nhóm yếu thế trong kỷ nguyên chuyển đổi số.",
    copyright: "© 2026 STEAMaze. Mọi quyền được bảo lưu.",
  },
};

// Mảng số liệu và nhận xét mặc định rỗng theo yêu cầu (không bịa số liệu)
export const landingStats: readonly { value: string; label: string }[] = [];
export const testimonials: readonly { quote: string; name: string; role: string }[] = [];

