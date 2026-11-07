interface FeatureItem {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

interface GameHotspot {
  number: number;
  x: number; // Tọa độ phần trăm theo chiều ngang (0 - 100%)
  y: number; // Tọa độ phần trăm theo chiều dọc (0 - 100%)
  label: string;
}

interface LandingGame {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  control: string;
  description: string;
  learnings: string[];
  image: string;
  imageAlt: string;
  objectPosition: string;
  video?: string;
  hotspots: GameHotspot[];
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksStep {
  step: string;
  icon: string;
  title: string;
  description: string;
}

interface WardrobeItem {
  name: string;
  image: string;
  slot: string;
}

interface LandingStat {
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// -------------------------------------------------------------
// DỮ LIỆU BA TRÒ CHƠI CHÍNH (TRỌNG TÂM CỦA TRANG)
// -------------------------------------------------------------
const landingGames: readonly LandingGame[] = [
  {
    id: "game-nguyen-tu-khoi",
    title: "Chuột Chạy Nguyên Tử Khối",
    subject: "Hoá học",
    subjectColor: "#2e9a3c",
    control: "🙂 Lắc đầu trái / phải (hoặc chạm, phím ← →)",
    description:
      "Chú chuột Whisker chạy băng băng trên đường rừng. Câu hỏi hiện lên: Natri nặng bao nhiêu? Nghiêng đầu sang trái hoặc phải để lao vào bệ ghi đúng nguyên tử khối. Đúng thì được xu, sai thì... rung cả màn hình!",
    learnings: [
      "Nhớ nguyên tử khối các nguyên tố thường gặp",
      "Phản xạ nhanh với ký hiệu hoá học",
      "3 bản đồ rừng, biển, thành phố khó dần",
    ],
    image: "/images/landing/game-nguyen-tu-khoi.webp",
    imageAlt:
      "Màn chơi Chuột Chạy Nguyên Tử Khối: chú chuột Whisker đội vương miện chạy trên đường rừng tới hai bệ đáp án 52 và 23 cho câu hỏi nguyên tử khối của Natri",
    objectPosition: "50% 60%",
    hotspots: [
      { number: 1, x: 50, y: 12, label: "Câu hỏi nguyên tử khối" },
      { number: 2, x: 50, y: 38, label: "Hai bệ đáp án: chạy vào đúng số" },
      { number: 3, x: 50, y: 76, label: "Đồ trong tủ đồ hiện ngay trên Whisker" },
      { number: 4, x: 9, y: 4, label: "Xu và cờ của màn" },
    ],
  },
  {
    id: "game-sau-rieng",
    title: "Chuột Hứng Sầu Riêng",
    subject: "Vật lý",
    subjectColor: "#e3792c",
    control: "✋ Vẫy tay trước camera (hoặc kéo, chạm)",
    description:
      "Cả vườn sầu riêng to nhỏ treo cao tới 25 mét. Quả rụng không báo trước, nhanh như chớp! Đưa tay qua lại để dắt Whisker đội thúng chạy tới hứng. Quan sát kỹ độ cao và cân nặng để đoán quả nào rơi trước.",
    learnings: [
      "Rơi tự do và thời gian rơi theo độ cao",
      "Vì sao quả nặng rơi nhanh hơn khi có lực cản không khí",
      "Đọc bảng số liệu sau mỗi ván",
    ],
    image: "/images/landing/game-sau-rieng.webp",
    imageAlt:
      "Màn chơi Chuột Hứng Sầu Riêng: vườn sầu riêng với thước đo độ cao 5-25m, chú chuột Whisker đội thúng hứng quả rơi",
    objectPosition: "45% 55%",
    hotspots: [
      { number: 1, x: 4, y: 45, label: "Thước đo độ cao 5–25 m" },
      { number: 2, x: 56, y: 34, label: "Quả to nhỏ, nặng nhẹ khác nhau" },
      { number: 3, x: 46, y: 80, label: "Chuột đội thúng: dắt bằng tay" },
    ],
  },
  {
    id: "game-guong-than",
    title: "Chuột Đấu Gương Thần",
    subject: "Quang học",
    subjectColor: "#3d7be0",
    control: "🎯 Di chuyển, xoay gương, ngắm và BẮN (cần điều khiển trên màn hình hoặc bàn phím)",
    description:
      "Đấu súng laser với máy tính trong mê cung gương. Không bắn thẳng được đâu: hãy xoay gương, canh góc tới để tia sáng nảy qua tường và trúng đối thủ trước khi bị bắn!",
    learnings: [
      "Định luật phản xạ ánh sáng (góc tới bằng góc phản xạ)",
      "Ước lượng góc",
      "Chiến thuật theo lượt (tối đa 15 lượt)",
    ],
    image: "/images/landing/game-guong-than.webp",
    imageAlt:
      "Màn chơi Chuột Đấu Gương Thần: góc nhìn thứ nhất với vạch ngắm laser, góc tới 8 độ, đối thủ Máy nấp sau tường",
    objectPosition: "50% 50%",
    hotspots: [
      { number: 1, x: 52, y: 47, label: "Góc tới i = 8°" },
      { number: 2, x: 50, y: 80, label: "Vạch ngắm tia laser" },
      { number: 3, x: 30, y: 37, label: "Đối thủ MÁY nấp sau tường" },
      { number: 4, x: 10, y: 4, label: "Máu BẠN và MÁY" },
      { number: 5, x: 96, y: 92, label: "Nút BẮN" },
    ],
  },
];

// -------------------------------------------------------------
// LỢI ÍCH (STEAMaze mang lại gì cho bạn?)
// -------------------------------------------------------------
const landingBenefits: readonly BenefitItem[] = [
  {
    icon: "🧠",
    title: "Hiểu bài nhanh hơn",
    description:
      "Mỗi màn là một bài học. Muốn chạy vào đúng bệ, hứng đúng quả, bắn trúng đích thì phải hiểu kiến thức.",
  },
  {
    icon: "✋",
    title: "Điều khiển bằng cơ thể",
    description:
      "AI nhận diện khuôn mặt và bàn tay qua camera. Lắc đầu để chạy, vẫy tay để hứng. Không có camera vẫn chơi bằng chạm hoặc chuột.",
  },
  {
    icon: "🎁",
    title: "Nhận quà thật sự",
    description:
      "Qua màn nhận xu, đổi vương miện, kính râm, mặt nạ... mặc lên nhân vật ngay trong trò chơi.",
  },
  {
    icon: "👫",
    title: "Chơi cùng bạn bè",
    description:
      "Lập nhóm, giữ chuỗi ngày học, so thành tích với cả lớp.",
  },
];

// -------------------------------------------------------------
// CÁCH CHƠI (3 BƯỚC)
// -------------------------------------------------------------
const howItWorksSteps: readonly HowItWorksStep[] = [
  {
    step: "01",
    icon: "⚡",
    title: "Đăng nhập",
    description: "Bấm Đăng nhập bằng Google, xong trong 1 giây.",
  },
  {
    step: "02",
    icon: "📷",
    title: "Bật camera & chơi",
    description:
      "Cho phép camera rồi lắc đầu, vẫy tay để điều khiển. Không có camera vẫn chơi được bằng chạm hoặc chuột.",
  },
  {
    step: "03",
    icon: "🎁",
    title: "Nhận quà & khoe",
    description:
      "Qua màn nhận xu, đổi đồ trong tủ đồ, mặc lên nhân vật và khoe với bạn bè.",
  },
];

const cameraSecurityNote =
  "An toàn cho học sinh: AI nhận diện chạy ngay trên máy của bạn, hình ảnh camera KHÔNG gửi lên máy chủ và không được lưu lại.";

// -------------------------------------------------------------
// TỦ ĐỒ & PHẦN THƯỞNG
// -------------------------------------------------------------
const wardrobeItems: readonly WardrobeItem[] = [
  {
    name: "Vương miện",
    image: "/items/hat_vuongmien.png",
    slot: "Đội đầu",
  },
  {
    name: "Kính râm",
    image: "/items/glasses_kinh.png",
    slot: "Đeo mắt",
  },
  {
    name: "Mặt nạ hacker",
    image: "/items/mask_matla.png",
    slot: "Đeo mặt",
  },
];

// -------------------------------------------------------------
// SỐ LIỆU & NHẬN XÉT (Mặc định mảng rỗng -> Không render)
// Khi có số liệu thật, điền vào đây:
// Ví dụ: { value: "1,200+", label: "Học sinh tham gia" }
// -------------------------------------------------------------
const landingStats: readonly LandingStat[] = [];
const testimonials: readonly Testimonial[] = [];

// -------------------------------------------------------------
// SỨ MỆNH & ĐỘI NGŨ (RÚT GỌN)
// -------------------------------------------------------------
const missionStatement = {
  quote:
    "“Tạo nên một nơi mà học sinh được chơi, được học và tự tin khám phá khoa học bằng chính đôi tay của mình.”",
  chips: ["Gần gũi", "Đáng tin cậy", "Cùng nhau"],
};

const teamRoles: readonly FeatureItem[] = [
  {
    number: "01",
    icon: "🧭",
    title: "Quản lý",
    description: "Điều phối cả nhóm, giữ tiến độ và định hướng sản phẩm.",
  },
  {
    number: "02",
    icon: "📢",
    title: "Truyền thông",
    description: "Đưa sản phẩm đến học sinh, giáo viên và phụ huynh.",
  },
  {
    number: "03",
    icon: "💡",
    title: "Ý tưởng",
    description: "Biến kiến thức khô khan thành màn chơi và phần thưởng hấp dẫn.",
  },
  {
    number: "04",
    icon: "⚙️",
    title: "Triển khai",
    description: "Xây dựng hand tracking, AI nhận diện mặt và toàn bộ hệ thống.",
  },
];

// Giữ lại các biến cũ phòng trường hợp có file khác tham chiếu
const missionPillars = teamRoles;
const steamFeatures = landingBenefits;
const teamGroups = teamRoles;

export {
  landingGames,
  landingBenefits,
  howItWorksSteps,
  cameraSecurityNote,
  wardrobeItems,
  landingStats,
  testimonials,
  missionStatement,
  teamRoles,
  missionPillars,
  steamFeatures,
  teamGroups,
};

export type {
  FeatureItem,
  GameHotspot,
  LandingGame,
  BenefitItem,
  HowItWorksStep,
  WardrobeItem,
  LandingStat,
  Testimonial,
};
