import { FC } from "react";
import { Text } from "react-native-gesture-handler";
import { ScreenProps } from "../navigation/types";

const temp: FC<ScreenProps<"temp">> = ({navigation}) => {
    return (
        <Text>Hello world</Text>
    );
}


export default temp;