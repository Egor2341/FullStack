import type { Item } from "../types/item"

interface ItemProps {
  item: Item
}

export const ExpensesJsonLd = ({ item }: ItemProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Item",
    headline: item.name,
    value: item.value,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
