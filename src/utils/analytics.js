export const calculateAnalytics = (data) => {

  const adoptionTrend = data.reduce((acc, curr) => {
    const year = curr['Model Year'];
    if (year && !isNaN(year)) {
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {});

  const trendData = Object.keys(adoptionTrend)
    .map(year => ({ year, count: adoptionTrend[year] }))
    .sort((a, b) => a.year - b.year);

  const typeDistribution = data.reduce((acc, curr) => {
    const type = curr['Electric Vehicle Type'] || '';
    
    if (type.includes('BEV')) {
      acc['BEV'] = (acc['BEV'] || 0) + 1;
    } else if (type.includes('PHEV')) {
      acc['PHEV'] = (acc['PHEV'] || 0) + 1;
    }
    return acc;
  }, {});

  const pieData = Object.keys(typeDistribution).map(key => ({
    name: key,
    value: typeDistribution[key]
  }));

  const rangeByMake = data.reduce((acc, curr) => {
    const make = curr.Make;
    const range = parseInt(curr['Electric Range']);
    
    // Only include valid ranges > 0 to avoid skewing average with "Unknown" (0) data
    if (make && !isNaN(range) && range > 0) {
      if (!acc[make]) acc[make] = { total: 0, count: 0 };
      acc[make].total += range;
      acc[make].count += 1;
    }
    return acc;
  }, {});

  const barData = Object.keys(rangeByMake)
    .map(make => ({
      name: make,
      avgRange: Math.round(rangeByMake[make].total / rangeByMake[make].count)
    }))
    .sort((a, b) => b.avgRange - a.avgRange)
    .slice(0, 10);

  return { trendData, pieData, barData };
};