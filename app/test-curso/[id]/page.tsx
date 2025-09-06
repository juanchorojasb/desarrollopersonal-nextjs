interface TestPageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: TestPageProps) {
  const { id } = await params;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🧪 TEST PÁGINA</h1>
      <div className="bg-green-100 p-4 rounded my-4">
        <p>✅ Destructuring funcionando correctamente</p>
        <p>✅ ID recibido: <strong>{id}</strong></p>
        <p>✅ Sin Clerk, sin problemas</p>
      </div>
    </div>
  );
}
