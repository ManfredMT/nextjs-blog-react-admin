import { Text, TrackballControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
//import * as THREE from "three";
import {Vector3, Quaternion, Spherical} from "three";


const defaultColors = [
  "BlueViolet",
  "GoldenRod",
  "Lime",
  "Crimson",
  "Blue",
  "OrangeRed",
];

function rotate(L, camera, ctr, speed) {
  const vector = ctr.current.target.clone();
  const l = new Vector3().subVectors(camera.position, vector).length();
  const up = camera.up.clone();
  const quaternion = new Quaternion();

  // Zoom correction
  camera.translateZ(L - l);

  quaternion.setFromAxisAngle(up, 0.00001 * speed);
  camera.position.applyQuaternion(quaternion);
}

function Word({ children, ctr, speed, cZ, ...props }) {
  const fontProps = {
    font: "/noto-sans-sc-700.woff",
    fontSize: 2.5,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref = useRef();

  useFrame(({ camera }) => {
    // Make text face the camera
    ref.current.quaternion.copy(camera.quaternion);
    rotate(cZ, camera, ctr, speed);
  });
  return <Text ref={ref} {...props} {...fontProps} children={children} />;
}

function Cloud({
  count = 4,
  radius = 20,
  ctr,
  colors,
  speed,
  cZ,
  modifiedWords,
}) {
  // Create a count x count words with spherical distribution
  const words = useMemo(() => {
    const temp = [];
    const spherical = new Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++) {
        const wordIndex = (i - 1) * count + j;
        temp.push([
          new Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j)
          ),
          modifiedWords[wordIndex],
        ]);
      }

    return temp;
  }, [count, radius, modifiedWords]);
  return words.map(([pos, word], index) => (
    <Word
      color={colors[index % colors.length]}
      ctr={ctr}
      key={index}
      position={pos}
      children={word}
      speed={speed}
      cZ={cZ}
    />
  ));
}

function getMSquare(n) {
  for (let i = 3; i < 30; i++) {
    if (n <= i * i) {
      return i;
    }
  }
  return 3;
}

function changeWords(words) {
  const wordsN = words.length;
  let newWords = words;
  const addNumber = getMSquare(wordsN) * getMSquare(wordsN) - wordsN;
  for (let i = 0; i < addNumber; i++) {
    newWords.push(words[i]);
  }
  return newWords;
}

function WordCloud({
  colors = defaultColors,
  cZ = 30,
  radius = 20,
  speed = 1,
  words,
}) {
  
  const controlsRef = useRef();
  const wordsNumber = useMemo(() => words.length, [words]);
  const countCloudT = useMemo(() => getMSquare(wordsNumber), [wordsNumber]);
  const modifiedWords = useMemo(() => changeWords(words), [words]);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
      <fog attach="fog" args={["#ffffff", 0, 70]} />
      <Cloud
        cZ={cZ}
        speed={speed}
        count={countCloudT}
        radius={radius}
        ctr={controlsRef}
        colors={colors}
        modifiedWords={modifiedWords}
      />
      <TrackballControls
        ref={controlsRef}
        noZoom={true}
      />
    </Canvas>
  );
}

export default WordCloud;
