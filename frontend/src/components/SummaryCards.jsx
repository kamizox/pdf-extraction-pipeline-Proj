export default function SummaryCards({ totalRecords, provinceCount }) {
  const cards = [
    { title: 'Total Records', value: totalRecords ?? '—' },
    { title: 'Year Range', value: '2005 – 2025' },
    { title: 'Provinces Covered', value: provinceCount ?? '—' },
    { title: 'Algorithms Ready', value: '5 ML Models' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-green-200 bg-flood-card p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-green-700">
            {card.title}
          </p>
          <p className="mt-2 text-2xl font-bold text-flood-text">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
