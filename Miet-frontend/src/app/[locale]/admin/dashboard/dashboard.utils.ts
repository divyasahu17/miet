export const defaultMapCenter = { lat: 28.6139, lng: 77.209 }; 

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';

  if (path.startsWith('http')) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
};

export const getGalleryImageUrl = (imagePath: string | undefined | null) => {
  if (!imagePath) return '/intro.webp';
  if (imagePath.startsWith('http')) return imagePath;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  const cleanUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${cleanUrl}${cleanPath}`;
};

export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

export const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minutes}${ampm}`;
};

export const filterAndSortData = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  sortField: string,
  sortDirection: 'asc' | 'desc'
) => {
  let filteredData = data;

  if (searchTerm) {
    filteredData = data.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  if (sortField) {
    filteredData.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filteredData;
};

export const paginateData = <T,>(data: T[], currentPage: number, itemsPerPage: number) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

export const getTotalPages = (totalItems: number, itemsPerPage: number) => Math.ceil(totalItems / itemsPerPage);
