// Extended types for new features

export interface SkillLevel {
    skill: string;
    level: number; // 0-100
    exercises: number;
    lastPracticed: string;
}

export interface StudentProgress {
    studentId: string;
    studentName: string;
    completedLessons: number;
    exercisesSolved: number;
    projectsSubmitted: number;
    skills: SkillLevel[];
    errorFrequency: number;
    lastActive: string;
    totalXP: number;
    currentLevel: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    xpReward: number;
    language: string;
    completed: boolean;
}

export interface ProjectRecommendation {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    skills: string[];
    estimatedTime: string;
    learningObjectives: string[];
}

export interface ArduinoProject {
    id: string;
    title: string;
    description: string;
    code: string;
    components: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface CodeVisualizationStep {
    line: number;
    description: string;
    variables: Record<string, any>;
    output?: string;
}
