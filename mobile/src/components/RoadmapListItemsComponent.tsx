import { StyleSheet, View } from "react-native";
import { Text } from "react-native-gesture-handler";
export  const ListRoadmapItems = (props:{roadmap: string[]}) => {
    console.log("Roadmap props:", props.roadmap);
    return <View style={styles.listContainer}>
        {props.roadmap?.map((topic: string, index: number) => (
        <View key={index} style={styles.topicCard}>
            <Text style={styles.topicItem}>{topic}</Text>
        </View>
    ))}
    </View>


}


const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    topicCard: {
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#fff9d9',
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    topicItem: {
        fontSize: 16,
        color: '#000',
    },
})                    