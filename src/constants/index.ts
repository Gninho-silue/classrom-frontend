import { Subject } from "@/types";

export const DEPARTMENTS = [
    'CS',
    'Math',
    'Physics',
    'English'
];

export const DEPARTMENTS_OPTIONS = DEPARTMENTS.map(dept => ({ 
    label: dept, value: dept.toLowerCase() 
}));

export const MOCK_COURSES: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description: "A foundational course covering fundamental concepts of computer science, including algorithms, data structures, and computational thinking.",
        createdAt: new Date().toString(),
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus II",
        department: "Math",
        description: "Advanced calculus topics including integration techniques, differential equations, and series. Prerequisite: Calculus I.",
        createdAt: new Date().toString(),
    },
    {
        id: 3,
        code: "PHYS150",
        name: "Physics for Engineers",
        department: "Physics",
        description: "A practical physics course designed for engineering students covering mechanics, thermodynamics, and wave motion with real-world applications.",
        createdAt: new Date().toString()
    }
];