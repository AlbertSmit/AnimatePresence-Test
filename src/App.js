import React from "react";
import {
  useTransition,
  animated,
  useSpringRef,
  useSpring,
  useChain
} from "@react-spring/web";
import { FloatingPortal } from "@floating-ui/react";
import useMeasure from "react-use-measure";

import "the-new-css-reset";
import "./styles.css";

const image =
  "https://images.unsplash.com/photo-1672349185191-8eeebc9ed8b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80";

export default function App() {
  const [ref, { height, width }] = useMeasure();

  return (
    <div
      {...{ ref }}
      style={{
        padding: "1rem",
        minHeight: "100vh",
        minWidth: "100vw",
        maxWidth: "100%"
      }}
      className="App"
    >
      <main
        style={{
          display: "grid",
          placeContent: "center",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem"
        }}
      >
        {Array.from({ length: 6 }, () => (
          <Card parent={{ height, width }} />
        ))}
      </main>
    </div>
  );
}

function Card({ data = 1 }) {
  const [open, setOpen] = React.useState(false);
  const [ref, { x, y, height, width }] = useMeasure();

  const sRef = useSpringRef();
  const springs = useSpring({
    ref: sRef,
    config: { duration: 0 },
    from: { opacity: 1 },
    to: { opacity: open ? 0 : 1 }
  });

  const tRef = useSpringRef();
  const transitions = useTransition(open ? data : [], {
    ref: tRef,
    from: {
      boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0)",
      borderRadius: "5px",
      left: x,
      top: y,
      height,
      width
    },
    enter: {
      boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.25)",
      borderRadius: "15px",
      left: window.innerWidth / 4,
      top: window.innerHeight / 4,
      width: Math.max(window.innerWidth / 2, width),
      height: window.innerHeight / 2
    },
    leave: {
      boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0)",
      borderRadius: "5px",
      left: x,
      top: y,
      height,
      width
    },
    update: {
      left: window.innerWidth / 4,
      top: window.innerHeight / 4,
      width: Math.max(window.innerWidth / 2, width),
      height: window.innerHeight / 2
    }
  });

  useChain(open ? [sRef, tRef] : [tRef, sRef]);

  return (
    <>
      <animated.div
        style={{
          width: "100%",
          minHeight: "200px",
          borderRadius: "5px",
          background: `url(${image}) top left / cover`,
          display: "flex",
          objectFit: "cover",
          objectPosition: "top left",
          ...springs
        }}
        onClick={() => setOpen(!open)}
        {...{ ref }}
      />
      <FloatingPortal>
        {transitions((style, item) => (
          <animated.div
            onClick={() => setOpen(false)}
            style={{
              zIndex: open ? 999 : 1,
              background: "#212121",
              color: "white",
              position: "absolute",
              overflow: "hidden",
              minWidth: "200px",
              ...style
            }}
          >
            <div
              style={{
                height,
                overflow: "hidden"
              }}
            >
              <img
                alt=""
                style={{
                  objectFit: "cover",
                  objectPosition: "top left",
                  userSelect: "none",
                  width: "100%"
                }}
                src={image}
              />
            </div>
            <Text>
              <Title />
              <p style={{ fontSize: "0.85em" }}>
                Praesent et viverra turpis, in ornare urna. Curabitur sed nisi
                fermentum, facilisis eros in, convallis massa. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Mauris.
              </p>
            </Text>
          </animated.div>
        ))}
      </FloatingPortal>
      {open && (
        <div
          style={{
            zIndex: open ? 998 : 1,
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "rgba(0,0,0,0.2)",
            userSelect: "none"
          }}
        />
      )}
    </>
  );
}

function Title() {
  return <strong style={{ color: "white", fontWeight: 800 }}>Titel</strong>;
}

function Text({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gap: ".325rem",
        fontFamily: "helvetica",
        fontWeight: 300,
        padding: "1rem",
        color: "#999"
      }}
    >
      {children}
    </div>
  );
}
