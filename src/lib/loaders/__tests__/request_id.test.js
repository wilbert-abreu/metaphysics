import { runAuthenticatedQuery, runQuery } from "test/utils"
import createLoaders from "../../../lib/loaders"
import gql from "test/gql"

jest.mock("../../apis/gravity", () => jest.fn(() => Promise.resolve({})))
import gravity from "../../apis/gravity"

describe("requestID (with the real data loaders)", () => {
  it("resolves to add the initial request ID to a gravity header", async () => {
    const query = gql`
      {
        artist(id: "andy-warhol") {
          name
        }
      }
    `

    const requestIDs = { requestId: "request-id" }
    const rootValue = createLoaders("access-token", "user-id", { requestIDs })
    expect.assertions(1)

    await runQuery(query, rootValue)

    expect(gravity).toBeCalledWith("artist/andy-warhol?", null, {
      requestIDs,
    })
  })

  it("(authenticated request) resolves to add the initial request ID to a gravity header", async () => {
    const query = gql`
      {
        me {
          lot_standings {
            is_highest_bidder
          }
        }
      }
    `
    const requestIDs = { requestId: "request-id" }
    const rootValue = createLoaders("secret", "user-42", { requestIDs })
    expect.assertions(1)
    await runAuthenticatedQuery(query, rootValue)

    expect(gravity).toBeCalledWith("me/lot_standings?", "secret", {
      requestIDs,
    })
  })
})
