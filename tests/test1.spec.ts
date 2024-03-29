import superagent from "superagent";
import { EXPECTED_OBJ_GET_BREEDS } from "../objects/breedsObj";
import { EXPECTED_OBJ_GET_FACTS } from "../objects/factsObj";
import { BASE_URL, BREEDS, FACT, FACTS } from "../constans/url";
import { EXPECTED_OBJ_GET_RANDOM_FACTS } from "../objects/randomFact";

describe("API testing. GET methods", () => {
  it("Returns a list of breeds", async () => {
    const res = await superagent.get(BASE_URL + BREEDS);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(EXPECTED_OBJ_GET_BREEDS);
  });

  it("Returns a list of breeds page 1", async () => {
    const res = await superagent.get(BASE_URL + BREEDS).query({ page: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(EXPECTED_OBJ_GET_BREEDS);
  });

  it("Returns a list of breeds limit 1", async () => {
    const res = await superagent.get(BASE_URL + BREEDS).query({ limit: 3 });
    let breeds = EXPECTED_OBJ_GET_BREEDS.data;
    let limitBreeds = res.body.data;
    const filteredBreeds = limitBreeds.filter((array: any) =>
      breeds.every(
        (breeds: any) =>
          !(
            limitBreeds.breed === array.breed &&
            breeds.country === array.country &&
            breeds.origin === array.origin
          )
      )
    );
    expect(res.status).toBe(200);
    expect(limitBreeds).toEqual(filteredBreeds);
  });

  it("Returns a random cat fact", async () => {
    const res = await superagent.get(BASE_URL + FACT);

    let facts = EXPECTED_OBJ_GET_RANDOM_FACTS.data;
    let randomFact = res.body;
    let array = [];
    array.push(randomFact);

    const filteredFacts = array.filter((array: any) =>
      facts.every(
        (facts: any) =>
          !(array.fact === array.fact && facts.lenght === array.length)
      )
    );
    function cleanSingleRecord(filteredFacts: any) {
      filteredFacts = JSON.stringify(filteredFacts);
      filteredFacts = filteredFacts.substring(1, filteredFacts.length - 1);
      return JSON.parse(filteredFacts.trim());
    }

    let objectFact = cleanSingleRecord(filteredFacts);

    expect(res.status).toBe(200);
    expect(res.body).not.toEqual(0);
    expect(res.body).toEqual(objectFact);
  });

  it("Returns a random cat fact max lenght 150", async () => {
    const res = await superagent
      .get(BASE_URL + FACT)
      .query({ max_length: 150 });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(150);
  });

  it("Get a list of cat facts", async () => {
    const res = await superagent.get(BASE_URL + FACTS);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(EXPECTED_OBJ_GET_FACTS);
  });

  it("Get a list of cat facts limit 50", async () => {
    const res = await superagent
      .get(BASE_URL + FACTS)
      .query({ max_length: 30 });
    let facts = EXPECTED_OBJ_GET_RANDOM_FACTS.data;
    let randomFacts = res.body.data;
    const filteredFacts = randomFacts.filter((array: any) =>
      facts.every(
        (facts: any) =>
          !(randomFacts.fact === array.fact && facts.lenght === array.length)
      )
    );
    expect(res.status).toBe(200);
    expect(randomFacts.length).toBeLessThanOrEqual(30);
    expect(randomFacts).toEqual(filteredFacts);
  });
});
