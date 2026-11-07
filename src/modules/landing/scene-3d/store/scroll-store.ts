/**
 * Lưu tiến độ cuộn (0..1) ngoài React.
 * Cảnh 3D đọc giá trị này trong useFrame, nên cuộn trang KHÔNG làm React vẽ lại cả cảnh (hết giật).
 */
type Listener = () => void;

const state = { progress: 0 };
const listeners = new Set<Listener>();

export const scrollStore = {
  get progress() {
    return state.progress;
  },
  set(p: number) {
    if (p === state.progress) return;
    state.progress = p;
    listeners.forEach((l) => l());
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
