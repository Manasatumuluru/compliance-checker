import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

type Rule = {
  id: number;
  jurisdiction: string; // 'federal' or state code
};

export default function ResultsChart({ rules }: { rules: Rule[] }) {
  const fed = rules.filter(r => r.jurisdiction.toLowerCase() === "federal").length;
  const state = rules.length - fed;

  const data = [
    { name: "Federal", value: fed },
    { name: "State", value: state },
  ];

  // Explicit colors (you can swap them if you prefer)
  const COLORS = ["#2563eb", "#16a34a"]; // blue for federal, green for state

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Rules by Jurisdiction</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
