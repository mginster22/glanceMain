// utils/getColorByName.ts
export const getColorByName = (name: string): string => {
  const colors = [
    "#A52A2A", // brown
    "#007bff", // blue
    "#28a745", // green
    "#6f42c1", // purple
    "#e83e8c", // pink
    "#fd7e14", // orange
    "#20c997", // teal
    "#ffc107", // yellow
  ];
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
