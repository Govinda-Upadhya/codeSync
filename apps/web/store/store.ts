import { create } from "zustand";

type State = {
  output: string[];
};
type Action = {
  setOutput: (result: string[]) => void;
};
export const useOutput = create<State & Action>((set) => ({
  output: [""],
  setOutput: (result: string[]) => set(() => ({ output: result })),
}));

type errorType = {
  error: string;
  setError: (faults: string) => void;
};

export const useError = create<errorType>((set) => ({
  error: "",
  setError: (faults: string) => set(() => ({ error: faults })),
}));

type OutputLoading = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useOutputLoading = create<OutputLoading>((set) => ({
  loading: false,
  setLoading: (loading: boolean) =>
    set((state) => ({ loading: !state.loading })),
}));

type saveModalType = {
  display: boolean;
  setDisplay: (display: boolean) => void;
};
export const useDisplayModal = create<saveModalType>((set) => ({
  display: false,
  setDisplay: (userargs: boolean) => set((state) => ({ display: userargs })),
}));
