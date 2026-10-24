export function formatDate(dateString?: string): string {
  if (!dateString) return 'Never worn';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysAgo(dateString?: string): string {
  if (!dateString) return 'Never';

  try {
    const past = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return dateString;
  }
}

export function getCostPerWear(price?: number, wearCount: number = 0): string {
  if (!price || price <= 0) return 'Free';
  if (wearCount === 0) return `$${price.toFixed(2)}`;
  const cpw = price / wearCount;
  return `$${cpw.toFixed(2)}/wear`;
}
