import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  PermissionsAndroid,
} from 'react-native';
// import RecordScreen, {RecordingResult} from 'react-native-record-screen';
import ScreenRecorder from 'react-native-screen-mic-recorder';
import RNFS from 'react-native-fs';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestAudioPermission();
    requestStoragePermission();
  }, []);
  // ScreenRecorder.startRecording({
  //   bitrate: 1024000, // default 236390400
  //   fps: 24, // default 60
  // });

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Recording Permission',
            message:
              'This app needs access to your microphone to record audio with the screen.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the microphone');
          setHasPermission(true);
        } else {
          console.log('Microphone permission denied');
          setHasPermission(false);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // For iOS, permissions are requested at the first use of the library.
      setHasPermission(true);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to save videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
        } else {
          console.log('Storage permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // This options can be passed to startRecording
  const options = {
    // mic: true, // defaults to true
    // width: ? // Defaults to Dimensions.get('window').width, ignored on Android
    // height: ? // Defaults to Dimensions.get('window').height, ignored on Android
    // androidBannerStopRecordingHandler: fn() // Android Only: Callback function to handle stop recording from notification baner
    // bitrate: 1024000, // default 236390400
    // fps: 60, // default 60
  };

  const startRecord = () => {
    // // recording start
    // const res = await RecordScreen.startRecording().catch((error) => console.error(error));
    // console.log(res);
    // if (res === RecordingResult.PermissionError) {
    //   // user denies access

    // }

    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Please grant audio recording permission',
      );
      return;
    }

    const options = {
      mic: true, // enable microphone
    };

    const recordingStatus = ScreenRecorder.startRecording(options).catch(
      error => {
        console.warn(error); // handle native error
      },
    );

    if (recordingStatus === 'started')
      if (recordingStatus === 'userDeniedPermission')
        // Recording has started
        Alert.alert('Plesae grant permission in order to record screen');
  };

  const stopRecord = async () => {
    // const res = await RecordScreen.stopRecording().catch((error) =>
    //   console.warn(error)
    // );
    // console.log(res, "when stop")
    // if (res) {ac
    //   const url = res;
    //   console.log(url, 'url')
    // }

    const uri = await ScreenRecorder.stopRecording().catch(
      error => console.warn(error), // handle native error
    );
    console.log(uri, 'path of recorded video');
    // uri is the path to the recorded video

    // Save the video to local storage
    const fileName = uri.split('/').pop(); // Get the file name from the URI
    const destinationPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    await RNFS.moveFile(uri, destinationPath);
    console.log('Video saved to', destinationPath);
    Alert.alert('Recording stopped', `Video saved to ${destinationPath}`);
    // const androidBannerStopRecordingHandler = uri => {
    //   console.log(
    //     'video uri, recording stopped from Android notification banner',
    //     uri,
    //   );
    // };
  };

  return (
    <SafeAreaView>
      <View>
        <Text>recorder</Text>
        <Button title="start" onPress={startRecord} />
        <Button title="stop" onPress={stopRecord} />
      </View>
    </SafeAreaView>
  );
};

export default App;
