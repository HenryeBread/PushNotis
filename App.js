import { Alert, Button, StatusBar } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";

Notification.setNotificationsHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowAlert: true
        };
    }
});

export default function App() {
    useEffect(() => {
        async function configurePushNotification() {
           const { status } = await Notifications.getPermissionsAsync();
           let finalStatus = status;

           if (finalStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
           }

           if (finalStatus !== 'granted') {
            Alert.alert('Permission required', 'Push notifications need appropriate permissions');
            return;
            }
            const pushTokenData = await Notifications.getExpoPushTokenAsync();
            console.log(pushTokenData);

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.DEFAULT
                });
            }
        }

        configurePushNotification();
        
    }, []);


    useEffect(() => {
       const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
            console.log('notification received');
            console.log(notification)
            const userName = response.notification.request.content.data.userName;
            console.log(userName)
        });

        const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('notification response received');
            console.log(response)
        });

        return () => {
            subscription1.remove();
            subscription2.remove();
        }
        
    }, []);
    function scheduleNotificationHandler() {
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'My first local notification', 
                body: 'This is the body of the notification',
                data: { userName: 'Max' }
            },
            trigger: {
                seconds: 5
            }
        });
    }

    function sendPushNotificationHandler() {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: '',
                title: 'Test - sent from a device!',
                body: 'This is a test!'
            })
        }
            
        );
    }


    return (
        <View style={styles.container}>
            <Button title="Schedule Notifications" onPress={scheduleNotificationHandler} />
            <Button title='Send Push Notification' onPress={sendPushNotificationHandler}/>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})