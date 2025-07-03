export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  mood: string;
  reason: string;
  type: 'login' | 'logout';
  moodNumber: number;
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  moodDistribution: { [key: string]: number };
  recentMoods: MoodEntry[];
  moodTrend: 'improving' | 'declining' | 'stable';
}

class MoodStorage {
  private readonly STORAGE_KEY = 'mindful_habits_mood_data';
  private readonly MAX_ENTRIES = 1000; // Keep last 1000 entries

  // Save mood entry
  saveMoodEntry(mood: string, reason: string, type: 'login' | 'logout'): void {
    try {
      const entries = this.getMoodEntries();
      const newEntry: MoodEntry = {
        id: this.generateId(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString(),
        mood,
        reason,
        type,
        moodNumber: this.moodToNumber(mood)
      };

      entries.unshift(newEntry); // Add to beginning

      // Keep only the last MAX_ENTRIES
      if (entries.length > this.MAX_ENTRIES) {
        entries.splice(this.MAX_ENTRIES);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  }

  // Get all mood entries
  getMoodEntries(): MoodEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  // Get mood entries for a specific date
  getMoodEntriesForDate(date: string): MoodEntry[] {
    const entries = this.getMoodEntries();
    return entries.filter(entry => entry.date === date);
  }

  // Get mood entries for the last N days
  getMoodEntriesForLastDays(days: number): MoodEntry[] {
    const entries = this.getMoodEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];

    return entries.filter(entry => entry.date >= cutoffDateString);
  }

  // Get today's mood entries
  getTodayMoodEntries(): MoodEntry[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getMoodEntriesForDate(today);
  }

  // Get mood statistics
  getMoodStats(days: number = 30): MoodStats {
    const entries = this.getMoodEntriesForLastDays(days);
    
    if (entries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        moodDistribution: {},
        recentMoods: [],
        moodTrend: 'stable'
      };
    }

    // Calculate average mood
    const totalMood = entries.reduce((sum, entry) => sum + entry.moodNumber, 0);
    const averageMood = totalMood / entries.length;

    // Calculate mood distribution
    const moodDistribution: { [key: string]: number } = {};
    entries.forEach(entry => {
      const moodLabel = this.getMoodLabel(entry.moodNumber);
      moodDistribution[moodLabel] = (moodDistribution[moodLabel] || 0) + 1;
    });

    // Get recent moods (last 10 entries)
    const recentMoods = entries.slice(0, 10);

    // Calculate mood trend
    const moodTrend = this.calculateMoodTrend(entries);

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      totalEntries: entries.length,
      moodDistribution,
      recentMoods,
      moodTrend
    };
  }

  // Get current day's average mood
  getTodayAverageMood(): number {
    const todayEntries = this.getTodayMoodEntries();
    if (todayEntries.length === 0) return 0;

    const totalMood = todayEntries.reduce((sum, entry) => sum + entry.moodNumber, 0);
    return Math.round((totalMood / todayEntries.length) * 10) / 10;
  }

  // Check if user has logged mood today
  hasLoggedMoodToday(): boolean {
    const todayEntries = this.getTodayMoodEntries();
    return todayEntries.length > 0;
  }

  // Get the latest mood entry
  getLatestMoodEntry(): MoodEntry | null {
    const entries = this.getMoodEntries();
    return entries.length > 0 ? entries[0] : null;
  }

  // Clear all mood data
  clearMoodData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Export mood data
  exportMoodData(): string {
    const entries = this.getMoodEntries();
    return JSON.stringify(entries, null, 2);
  }

  // Import mood data
  importMoodData(data: string): boolean {
    try {
      const entries = JSON.parse(data);
      if (Array.isArray(entries)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing mood data:', error);
      return false;
    }
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private moodToNumber(mood: string): number {
    const moodMap: { [key: string]: number } = {
      'Happy': 4,
      'Excited': 4,
      'Calm': 3,
      'Neutral': 2,
      'Tired': 1,
      'Sad': 0,
      'Angry': 0
    };
    return moodMap[mood] ?? 2;
  }

  private getMoodLabel(moodNumber: number): string {
    const labels = ['Very Sad', 'Sad', 'Neutral', 'Good', 'Great'];
    return labels[moodNumber] || 'Neutral';
  }

  private calculateMoodTrend(entries: MoodEntry[]): 'improving' | 'declining' | 'stable' {
    if (entries.length < 2) return 'stable';

    // Split entries into two halves
    const midPoint = Math.floor(entries.length / 2);
    const recentEntries = entries.slice(0, midPoint);
    const olderEntries = entries.slice(midPoint);

    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.moodNumber, 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.moodNumber, 0) / olderEntries.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }
}

// Export singleton instance
export const moodStorage = new MoodStorage(); 