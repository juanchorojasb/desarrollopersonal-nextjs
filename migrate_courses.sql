-- Migración de cursos basada en documentación
-- Ejecutar en desarrollopersonal_db

-- 1. Verificar si existe tabla modules
CREATE TABLE IF NOT EXISTS modules (
  id varchar(191) NOT NULL PRIMARY KEY,
  title varchar(191) NOT NULL,
  description text,
  courseId varchar(191) NOT NULL,
  position int NOT NULL DEFAULT 0,
  createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt datetime(3) NOT NULL
);

-- 2. Insertar el curso principal "Hábitos de Estudio Efectivos"
INSERT INTO courses (
  id, 
  title, 
  description, 
  instructor, 
  duration, 
  category, 
  status, 
  createdAt, 
  updatedAt
) VALUES (
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  'Hábitos de Estudio Efectivos',
  'Curso completo sobre técnicas de estudio efectivas y métodos de aprendizaje optimizados. Aprende técnicas probadas como el Método de los Palacios de Memoria, Mapas Mentales y la Técnica Pomodoro.',
  'Dr. Ana Mendoza',
  300,
  'Educación',
  'published',
  NOW(),
  NOW()
);

-- 3. Insertar módulo del curso
INSERT INTO modules (
  id,
  title,
  description,
  courseId,
  position,
  createdAt,
  updatedAt
) VALUES (
  UUID(),
  'Módulo 1: Fundamentos de Hábitos de Estudio',
  'Módulo principal del curso con todas las lecciones',
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  1,
  NOW(),
  NOW()
);

-- 4. Obtener el ID del módulo creado (para las lecciones)
SET @moduleId = (SELECT id FROM modules WHERE courseId = '8ef86e1b-3c10-4131-a89d-baae3804d3ec' LIMIT 1);

-- 5. Insertar las lecciones del curso
INSERT INTO lessons (
  id,
  title,
  description,
  videoId,
  videoDuration,
  position,
  moduleId,
  createdAt,
  updatedAt
) VALUES 
(
  UUID(),
  'Introducción a los Hábitos de Estudio',
  'Fundamentos básicos para desarrollar hábitos de estudio efectivos',
  '86e279ce-ee92-494d-aaad-47719c3b86fe',
  60,
  1,
  @moduleId,
  NOW(),
  NOW()
),
(
  UUID(),
  'El Método de los Palacios de Memoria',
  'Técnica avanzada de memorización utilizando espacios mentales',
  'f88c9edf-3c7a-4186-80c1-88237f32c40b',
  60,
  2,
  @moduleId,
  NOW(),
  NOW()
),
(
  UUID(),
  'Mapas Mentales y Asociaciones',
  'Cómo crear mapas mentales efectivos para el aprendizaje',
  '846aa33a-ae7d-4531-95e1-a5e4c575d289',
  60,
  3,
  @moduleId,
  NOW(),
  NOW()
),
(
  UUID(),
  'La Técnica Pomodoro para Estudiar',
  'Gestión del tiempo y concentración mediante intervalos de trabajo',
  '3b8eb44e-39a6-480f-b87f-aa96334e4a8f',
  60,
  4,
  @moduleId,
  NOW(),
  NOW()
),
(
  UUID(),
  'Construyendo Rutinas Duraderas',
  'Cómo mantener hábitos de estudio a largo plazo',
  '014a0983-b268-4372-a94d-3699e86ee76c',
  60,
  5,
  @moduleId,
  NOW(),
  NOW()
);

-- 6. Verificar inserción
SELECT 'Cursos insertados:' as status, COUNT(*) as total FROM courses;
SELECT 'Módulos insertados:' as status, COUNT(*) as total FROM modules;
SELECT 'Lecciones insertadas:' as status, COUNT(*) as total FROM lessons;

-- 7. Mostrar estructura del curso creado
SELECT 
  c.title as curso,
  m.title as modulo,
  l.title as leccion,
  l.videoId,
  l.position as orden
FROM courses c
LEFT JOIN modules m ON c.id = m.courseId
LEFT JOIN lessons l ON m.id = l.moduleId
WHERE c.id = '8ef86e1b-3c10-4131-a89d-baae3804d3ec'
ORDER BY l.position; 
(
  UUID(),
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  'Introducción a los Hábitos de Estudio',
  'Fundamentos básicos para desarrollar hábitos de estudio efectivos',
  '86e279ce-ee92-494d-aaad-47719c3b86fe',
  60,
  1,
  NOW(),
  NOW()
),
(
  UUID(),
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  'El Método de los Palacios de Memoria',
  'Técnica avanzada de memorización utilizando espacios mentales',
  'f88c9edf-3c7a-4186-80c1-88237f32c40b',
  60,
  2,
  NOW(),
  NOW()
),
(
  UUID(),
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  'Mapas Mentales y Asociaciones',
  'Cómo crear mapas mentales efectivos para el aprendizaje',
  '846aa33a-ae7d-4531-95e1-a5e4c575d289',
  60,
  3,
  NOW(),
  NOW()
),
(
  UUID(),
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  'La Técnica Pomodoro para Estudiar',
  'Gestión del tiempo y concentración mediante intervalos de trabajo',
  '3b8eb44e-39a6-480f-b87f-aa96334e4a8f',
  60,
  4,
  NOW(),
  NOW()
),
(
  UUID(),
  '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
  'Construyendo Rutinas Duraderas',
  'Cómo mantener hábitos de estudio a largo plazo',
  '014a0983-b268-4372-a94d-3699e86ee76c',
  60,
  5,
  NOW(),
  NOW()
);

-- 3. Verificar inserción
SELECT 'Cursos insertados:' as status, COUNT(*) as total FROM courses;
SELECT 'Lecciones insertadas:' as status, COUNT(*) as total FROM lessons;

-- 4. Mostrar estructura del curso creado
SELECT 
  c.title as curso,
  l.title as leccion,
  l.videoId,
  l.orderIndex as orden
FROM courses c
LEFT JOIN lessons l ON c.id = l.courseId
WHERE c.id = '8ef86e1b-3c10-4131-a89d-baae3804d3ec'
ORDER BY l.orderIndex;
