import { createSelector } from "reselect"
import { List, Map, fromJS } from "immutable"

const state = state => state

export const shownDefinitions = createSelector(
    state,
    auth => auth.get( "showDefinitions" )
)

export const definitionsToAuthorize = createSelector(
    state,
    () =>( { specSelectors } ) => {
      let definitions = specSelectors.securityDefinitions()
      let list = List()

      //todo refactor
      definitions.entrySeq().forEach( ([ key, val ]) => {
        let map = Map()

        map = map.set(key, val)
        list = list.push(map)
      })

      return list
    }
)


export const getDefinitionsByNames = ( state, securities ) =>( { specSelectors } ) => {
  let securityDefinitions = specSelectors.securityDefinitions()
  let result = List()

  securities.valueSeq().forEach( (names) => {
    let map = Map()
    names.entrySeq().forEach( ([name, scopes]) => {
      let definition = securityDefinitions.get(name)
      let allowedScopes

      if ( definition.get("type") === "oauth2" && scopes.size ) {
        allowedScopes = definition.get("scopes")

        allowedScopes.keySeq().forEach( (key) => {
          if ( !scopes.contains(key) ) {
            allowedScopes = allowedScopes.delete(key)
          }
        })

        definition = definition.set("allowedScopes", allowedScopes)
      }

      map = map.set(name, definition)
    })

    result = result.push(map)
  })

  return result
}

export const getQueryToken = createSelector(
  state,
  auth => auth.get( "query_token" )
)

export const authorized = createSelector(
  state,
  getQueryToken,
  (auth, query_token) => ({specSelectors}) => {
    let authorized = auth.get("authorized") || Map()
    if(query_token) {
      const defenitions = specSelectors.securityDefinitions()
      const oauth2Definitions = defenitions.filter(def => def.get("type") === "oauth2")
      const auth = {}
      oauth2Definitions.forEach((schema, name) => {
        auth.name = name
        auth.schema = schema
        return false
      })

      if (auth.name && auth.schema) {
        const schema = auth.schema
        auth.token = {
          access_token: query_token
        }
        const scopes = schema.get("allowedScopes") || schema.get("scopes")
        auth.scopes = scopes.valueSeq().toJS()

        authorized = authorized.set(auth.name, fromJS(auth))
      }
    }
    return authorized
  }
)

export const isAuthorized = ( state, securities ) =>( { authSelectors } ) => {
  let authorized = authSelectors.authorized()

  if(!List.isList(securities)) {
    return null
  }

  return !!securities.toJS().filter( ( security ) => {
      let isAuthorized = true

      return Object.keys(security).map((key) => {
        return !isAuthorized || !!authorized.get(key)
      }).indexOf(false) === -1
    }).length
}

export const getConfigs = createSelector(
    state,
    auth => auth.get( "configs" )
)
