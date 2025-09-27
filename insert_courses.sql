-- Script para insertar los 7 cursos de desarrollo personal (MySQL)
-- Curso 1: Hábitos de estudio
INSERT INTO courses (id, title, description, shortDesc, level, category, price, status, instructor, duration, studentsCount, createdAt, updatedAt) 
VALUES (
  'course_habitos_estudio',
  'Hábitos de estudio',
  'Desarrolla técnicas efectivas de estudio y organización para maximizar tu aprendizaje y rendimiento académico. Aprende a crear rutinas sostenibles, mejorar tu concentración y optimizar tu tiempo de estudio.',
  'Técnicas efectivas de estudio y organización',
  'beginner',
  'desarrollo-personal',
  0,
  'published',
  'Dra. Luz Marina',
  150,
  0,
  NOW(),
  NOW()
);

-- Módulos para Hábitos de estudio
INSERT INTO modules (id, title, description, position, courseId, duration, createdAt, updatedAt) VALUES
('mod_habitos_1', 'Fundamentos de los hábitos de estudio', 'Introducción a la ciencia detrás de los hábitos efectivos', 1, 'course_habitos_estudio', 30, NOW(), NOW()),
('mod_habitos_2', 'Técnicas de concentración y enfoque', 'Métodos para mejorar la concentración', 2, 'course_habitos_estudio', 25, NOW(), NOW()),
('mod_habitos_3', 'Optimización del espacio de estudio', 'Diseño del entorno ideal para estudiar', 3, 'course_habitos_estudio', 20, NOW(), NOW()),
('mod_habitos_4', 'Gestión avanzada del tiempo', 'Planificación y organización del tiempo de estudio', 4, 'course_habitos_estudio', 35, NOW(), NOW()),
('mod_habitos_5', 'Mantenimiento de hábitos', 'Estrategias para mantener hábitos a largo plazo', 5, 'course_habitos_estudio', 30, NOW(), NOW());

-- Lecciones para Hábitos de estudio
INSERT INTO lessons (id, title, description, position, type, videoUrl, videoDuration, moduleId, createdAt, updatedAt) VALUES
('lesson_habitos_1', 'Fundamentos de los hábitos de estudio', 'Introducción a la importancia de crear hábitos efectivos de estudio', 1, 'video', 'https://iframe.mediadelivery.net/play/476857/86e279ce-ee92-494d-aaad-47719c3b86fe', 1800, 'mod_habitos_1', NOW(), NOW()),
('lesson_habitos_2', 'Técnicas de concentración', 'Métodos para mejorar tu capacidad de concentración', 1, 'video', 'https://iframe.mediadelivery.net/play/476857/f88c9edf-3c7a-4186-80c1-88237f32c40b', 1500, 'mod_habitos_2', NOW(), NOW()),
('lesson_habitos_3', 'Organización del espacio de estudio', 'Como crear un ambiente propicio para el aprendizaje', 1, 'video', 'https://iframe.mediadelivery.net/play/476857/846aa33a-ae7d-4531-95e1-a5e4c575d289', 1200, 'mod_habitos_3', NOW(), NOW()),
('lesson_habitos_4', 'Gestión del tiempo de estudio', 'Planificación efectiva del tiempo dedicado al estudio', 1, 'video', 'https://iframe.mediadelivery.net/play/476857/3b8eb44e-39a6-480f-b87f-aa96334e4a8f', 2100, 'mod_habitos_4', NOW(), NOW()),
('lesson_habitos_5', 'Mantenimiento de hábitos a largo plazo', 'Estrategias para sostener los nuevos hábitos en el tiempo', 1, 'video', 'https://iframe.mediadelivery.net/play/476857/014a0983-b268-4372-a94d-3699e86ee76c', 1800, 'mod_habitos_5', NOW(), NOW());
