import type { CalculationResult } from '../types';

const STORAGE_KEY = 'lien_manager_calculation';

export function saveCalculation(result: CalculationResult): void {
  try {
    const serialized = JSON.stringify(result);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save calculation to localStorage:', error);
  }
}

export function loadCalculation(): CalculationResult | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return null;
    }

    const result = JSON.parse(serialized);

    if (!result.deadlines || !Array.isArray(result.deadlines)) {
      console.warn('Old data structure detected, clearing localStorage');
      clearCalculation();
      return null;
    }

    result.projectDetails.firstFurnishingDate = result.projectDetails.firstFurnishingDate
      ? new Date(result.projectDetails.firstFurnishingDate)
      : null;
    result.projectDetails.lastFurnishingDate = result.projectDetails.lastFurnishingDate
      ? new Date(result.projectDetails.lastFurnishingDate)
      : null;
    result.projectDetails.projectCompletionDate = result.projectDetails.projectCompletionDate
      ? new Date(result.projectDetails.projectCompletionDate)
      : null;

    if (result.deadlines && Array.isArray(result.deadlines)) {
      result.deadlines = result.deadlines.map((deadline: any) => ({
        ...deadline,
        date: new Date(deadline.date),
      }));
    }

    result.calculatedAt = new Date(result.calculatedAt);

    return result;
  } catch (error) {
    console.error('Failed to load calculation from localStorage:', error);
    clearCalculation();
    return null;
  }
}


const PROJECTS_STORAGE_KEY = 'lien_manager_projects';


export function saveProject(result: CalculationResult): CalculationResult {
  try {
    const projects = getProjects();

    if (!result.id) {
      result.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    }

    const index = projects.findIndex(p => p.id === result.id);

    if (index >= 0) {
      projects[index] = result;
    } else {
      projects.push(result);
    }

    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    return result;
  } catch (error) {
    console.error('Failed to save project to projects list:', error);
    return result;
  }
}

export function getProjects(): CalculationResult[] {
  try {
    const serialized = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!serialized) return [];

    const projects = JSON.parse(serialized);
    if (!Array.isArray(projects)) return [];

    return projects.map((result: any) => {
      // Hydrate dates similar to loadCalculation
      if (result.projectDetails) {
        result.projectDetails.firstFurnishingDate = result.projectDetails.firstFurnishingDate
          ? new Date(result.projectDetails.firstFurnishingDate)
          : null;
        result.projectDetails.lastFurnishingDate = result.projectDetails.lastFurnishingDate
          ? new Date(result.projectDetails.lastFurnishingDate)
          : null;
        result.projectDetails.projectCompletionDate = result.projectDetails.projectCompletionDate
          ? new Date(result.projectDetails.projectCompletionDate)
          : null;
      }

      if (result.deadlines && Array.isArray(result.deadlines)) {
        result.deadlines = result.deadlines.map((deadline: any) => ({
          ...deadline,
          date: new Date(deadline.date),
        }));
      }

      result.calculatedAt = new Date(result.calculatedAt);
      return result;
    });
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

export function deleteProject(id: string): void {
  try {
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete project:', error);
  }
}

export function clearCalculation(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear calculation from localStorage:', error);
  }
}

