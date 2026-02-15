// Sistema de puntos y niveles

export const POINTS_CONFIG = {
  // Cursos
  COMPLETE_LESSON: 10,
  COMPLETE_MODULE: 50,
  COMPLETE_COURSE: 100,
  
  // Comunidad
  CREATE_POST: 20,
  CREATE_REPLY: 10,
  RECEIVE_REACTION: 5,
  
  // Racha diaria
  DAILY_LOGIN: 5,
  STREAK_BONUS_3: 15,
  STREAK_BONUS_7: 35,
  STREAK_BONUS_30: 150,
  
  // Especiales
  EARLY_BIRD: 25,
  NIGHT_OWL: 25,
  WEEKEND_WARRIOR: 50,
};

// Fórmula de niveles: nivel = sqrt(puntos / 100)
export function calculateLevel(totalPoints: number): number {
  return Math.floor(Math.sqrt(totalPoints / 100)) + 1;
}

// Puntos necesarios para el siguiente nivel
export function pointsForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

// Progreso al siguiente nivel (0-100%)
export function levelProgress(totalPoints: number): {
  currentLevel: number;
  nextLevel: number;
  pointsForNext: number;
  currentLevelPoints: number;
  progress: number;
} {
  const currentLevel = calculateLevel(totalPoints);
  const nextLevel = currentLevel + 1;
  const pointsForCurrent = pointsForNextLevel(currentLevel - 1);
  const pointsForNext = pointsForNextLevel(currentLevel);
  const currentLevelPoints = totalPoints - pointsForCurrent;
  const pointsNeeded = pointsForNext - pointsForCurrent;
  const progress = Math.min(100, (currentLevelPoints / pointsNeeded) * 100);

  return {
    currentLevel,
    nextLevel,
    pointsForNext: pointsForNext - totalPoints,
    currentLevelPoints,
    progress,
  };
}

// Títulos por nivel
export function getLevelTitle(level: number): string {
  if (level >= 50) return 'Leyenda';
  if (level >= 25) return 'Maestro';
  if (level >= 10) return 'Experto';
  if (level >= 5) return 'Aprendiz';
  return 'Principiante';
}

// Emoji por nivel
export function getLevelEmoji(level: number): string {
  if (level >= 50) return '👑';
  if (level >= 25) return '⭐⭐⭐';
  if (level >= 10) return '⭐⭐';
  if (level >= 5) return '⭐';
  return '🌱';
}
