import { useState } from "react";
import ResultsChart from "./components/ResultsChart";

type Rule = {
  id: number;
  code: string;
  category: string;
  jurisdiction: string;
  industry: string;
  minEmployees: number;
  maxEmployees: number;
  description: string;
};

const API_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export default function App() {
  const [name, setName] = useState("My Business");
  const [state, setState] = useState("TX");
  const [industry, setIndustry] = useState("retail");
  const [employees, setEmployees] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [count, setCount] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setRules([]);
    setCount(null);

    try {
      const res = await fetch(`${API_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, state, industry, employees }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setRules(data.rules || []);
      setCount(data.count ?? null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">US Compliance Checker</h1>

        <form
  onSubmit={onSubmit}
  className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow"
>
  {/* Business Name */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      Business Name
    </label>
    <input
      className="border rounded-lg p-2"
      placeholder="My Business"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>

  {/* State */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      State
    </label>
    <select
      className="border rounded-lg p-2"
      value={state}
      onChange={(e) => setState(e.target.value)}
    >
      {[
        "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
        "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
        "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
        "VA","WA","WV","WI","WY"
      ].map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>

  {/* Industry */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      Industry
    </label>
    <select
      className="border rounded-lg p-2"
      value={industry}
      onChange={(e) => setIndustry(e.target.value)}
    >
      <option value="retail">Retail</option>
      <option value="construction">Construction</option>
      <option value="hospitality">Hospitality</option>
      <option value="healthcare">Healthcare</option>
      <option value="finance">Finance</option>
      <option value="education">Education</option>
      <option value="manufacturing">Manufacturing</option>
      <option value="transportation">Transportation</option>
      <option value="tech">Technology</option>
      <option value="agriculture">Agriculture</option>
    </select>
  </div>

  {/* Employees */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      Employees
    </label>
    <input
      type="number"
      min={1}
      className="border rounded-lg p-2"
      placeholder="Number of employees"
      value={employees}
      onChange={(e) => setEmployees(parseInt(e.target.value || "0", 10))}
    />
  </div>

  {/* Button spans full width */}
  <button
    type="submit"
    className="md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 font-medium"
    disabled={loading}
  >
    {loading ? "Checking…" : "Check Compliance"}
  </button>
</form>


        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {count !== null && (
          <>
            {/* Pie chart */}
            <ResultsChart rules={rules} />

            {/* Results list */}
            <div className="bg-white rounded-xl shadow p-4 mt-4">
              <h2 className="text-xl font-semibold mb-3">Results ({count})</h2>
              <div className="space-y-3">
                {rules.map((r) => (
                  <div key={r.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{r.category}</div>
                      <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100 border">
                        {r.jurisdiction.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {r.code} • {r.industry} • {r.minEmployees}-{r.maxEmployees} employees
                    </div>
                    <p className="mt-2 text-gray-800">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
