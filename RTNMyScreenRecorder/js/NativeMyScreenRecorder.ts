import { TurboModule, TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
startRecording():void;
stopRecording():void;
}

export default TurboModuleRegistry.get<Spec>("RTNMyScreenRecorder") as Spec | null;