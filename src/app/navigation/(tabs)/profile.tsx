import {View, Text} from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../../../../lib/auth-context';

export default function profileTab() {

    const { logOut } = useAuth();

    return (
        <View>
            <Text>Profile Tab</Text>
            <Button mode='text' onPress={logOut} icon={"logout"}>Log Out</Button>
        </View>
    );
}