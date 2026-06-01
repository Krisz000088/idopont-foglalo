import { supabase } from "./supabase";

function TestSupabase() {
  async function testInsert() {
    const { data, error } = await supabase
      .from("szolgaltatok")
      .insert([
        {
          nev: "Teszt Móni",
          profilnev: "Teszt Profil",
          email: "teszt2@teszt.hu",
          pin: "1234",
          vendegkod: "TEST1234",
        },
      ]);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert("Hiba történt!");
    } else {
      alert("Sikeres mentés!");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Supabase teszt</h1>

      <button onClick={testInsert}>
        Teszt mentés
      </button>
    </div>
  );
}

export default TestSupabase;