import { LabelListItem } from "./LabelListItem";

export function LabelList({ labels }) {
  return (
    <>
      {labels.map((label) => (
        <LabelListItem key={label.id} label={label} />
      ))}
    </>
  );
}
