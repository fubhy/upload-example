import 'isomorphic-unfetch'
import { Component } from 'react'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { getDataFromTree, ApolloProvider } from 'react-apollo'
import getDisplayName from 'react-display-name'
import Head from 'next/head'

const ssrMode = !process.browser

// To share an instance between pages on the client
let apolloClient

console.log(process.env.API_URI);
/**
 * Creates a new Apollo Client instance.
 * @param {Object} [initialState] - Redux initial state.
 * @returns {Object} Apollo Client instance.
 */
const createApolloClient = (initialState = {}) =>
  new ApolloClient({
    ssrMode,
    cache: new InMemoryCache().restore(initialState),
    link: createUploadLink({ uri: `${process.env.API_URI}?XDEBUG_SESSION_START=PHPSTORM` })
  })

export default ComposedComponent =>
  class WithData extends Component {
    static displayName = `WithData(${getDisplayName(ComposedComponent)})`

    /**
     * Gets the initial props for a Next.js page component.
     * Executes on the server for the initial page load. Executes on the client
     * when navigating to a different route via the Link component or using the
     * routing APIs. For either environment the initial props returned must be
     * serializable to JSON.
     * @see https://github.com/zeit/next.js/#fetching-data-and-component-lifecycle
     * @param {Object} context
     * @param {String} context.pathname - Page URL path.
     * @param {String} context.asPath - Page URL path and query as shown in browser.
     * @param {Object} context.query - Query string section of the page URL parsed as an object.
     * @param {Object} context.req - HTTP request (server only).
     * @param {Object} context.res - HTTP response (server only).
     * @param {Object} context.jsonPageRes - Fetch Response (client only).
     * @param {Object} context.err - Error encountered during the rendering, if any.
     * @returns {Promise} Page component props.
     */
    static async getInitialProps(context) {
      const initialProps = {
        composedComponentProps: {
          url: {
            pathname: context.pathname,
            asPath: context.asPath,
            query: context.query
          }
        }
      }

      // If the page component has initial props, merge them in.
      if (ComposedComponent.getInitialProps)
        Object.assign(
          initialProps.composedComponentProps,
          await ComposedComponent.getInitialProps(context)
        )

      if (ssrMode) {
        const apolloClient = createApolloClient()

        try {
          // Recurse the component tree and prefetch all Apollo data queries to
          // populate the Apollo Client Redux store. This allows an instant
          // server side render.
          // See: https://www.apollographql.com/docs/react/recipes/server-side-rendering.html#getDataFromTree
          await getDataFromTree(
            <ApolloProvider client={apolloClient}>
              <ComposedComponent {...initialProps.composedComponentProps} />
            </ApolloProvider>
          )
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR. Handle them
          // in components via the data.error prop.
          // See: https://www.apollographql.com/docs/react/basics/queries.html#graphql-query-data-error
          // eslint-disable-next-line no-console
          console.error(error.message)
        }

        // Forget Head items found during the getDataFromTree render to prevent
        // duplicates in the real render.
        Head.rewind()

        // Set Apollo Client initial state so the client can adopt data fetched
        // on the server.
        initialProps.initialState = apolloClient.cache.extract()
      }

      // Return the final page component inital props
      return initialProps
    }

    constructor(props) {
      super(props)
      if (ssrMode)
        // For the server an Apollo Client instance exists per request
        this.apolloClient = createApolloClient(this.props.initialState)
      else {
        // For the client an Apollo Client instance is shared between pages
        if (!apolloClient)
          apolloClient = createApolloClient(this.props.initialState)
        this.apolloClient = apolloClient
      }
    }

    render() {
      return (
        <ApolloProvider client={this.apolloClient}>
          <ComposedComponent {...this.props.composedComponentProps} />
        </ApolloProvider>
      )
    }
  }
