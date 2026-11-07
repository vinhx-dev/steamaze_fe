import { PALETTE, mat } from "../materials";

/** Vương miện vàng đính hồng ngọc (đặt trong nhóm đầu chuột) */
export function Crown() {
  const gold = mat(PALETTE.gold, { rough: 0.25, metal: 0.85 });
  return (
    <group position={[0, 0.4, 0]}>
      <mesh material={gold}>
        <cylinderGeometry args={[0.23, 0.21, 0.12, 32, 1, true]} />
      </mesh>
      <mesh position={[0, -0.05, 0]} material={gold}>
        <cylinderGeometry args={[0.21, 0.21, 0.02, 32]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * Math.PI * 2) / 5;
        return (
          <group key={i} position={[Math.sin(a) * 0.22, 0.11, Math.cos(a) * 0.22]}>
            <mesh material={gold}>
              <coneGeometry args={[0.045, 0.14, 12]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={gold}>
              <sphereGeometry args={[0.025, 12, 8]} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.01, 0.225]} material={mat(PALETTE.ruby, { rough: 0.15, metal: 0.2 })}>
        <octahedronGeometry args={[0.04, 1]} />
      </mesh>
    </group>
  );
}

/** Kính râm */
export function Glasses() {
  const black = mat(PALETTE.black, { rough: 0.15, metal: 0.3 });
  return (
    <group position={[0, 0.06, 0.37]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.13, 0, 0]} scale={[1, 0.72, 0.25]} material={black}>
          <sphereGeometry args={[0.1, 24, 12]} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]} material={black}>
        <boxGeometry args={[0.08, 0.022, 0.02]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.23, 0.01, -0.12]} rotation={[0, s * 0.25, 0]} material={black}>
          <boxGeometry args={[0.018, 0.018, 0.24]} />
        </mesh>
      ))}
    </group>
  );
}

/** Mặt nạ hacker: nửa mặt trắng, mắt và miệng đen */
export function Mask() {
  const ink = mat(PALETTE.black);
  return (
    <group position={[0, -0.05, 0.3]}>
      <mesh scale={[1, 0.9, 0.55]} material={mat(PALETTE.white, { rough: 0.5 })}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} />
      </mesh>
      <mesh position={[0, -0.13, 0.155]} material={ink}>
        <boxGeometry args={[0.14, 0.018, 0.02]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.07, -0.16, 0.14]} rotation={[0, 0, s * 0.5]} material={ink}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
        </mesh>
      ))}
    </group>
  );
}
