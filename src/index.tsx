import { FC } from "react";
import "./index.scss";
import testImage from "./test.webp";

const Index: FC = ({}) => {
  return (
    <div>
      <h1>hello webpack!</h1>
      <img src={testImage} />
    </div>
  );
};

export default Index;
