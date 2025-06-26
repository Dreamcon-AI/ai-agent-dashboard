export function useToast() {
  return {
    toast: ({ title = "Notice", description = "" }) => {
      alert(`${title}${description ? ": " + description : ""}`);
    },
  };
}
