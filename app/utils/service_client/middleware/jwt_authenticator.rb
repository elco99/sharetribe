module ServiceClient
  module Middleware

    TOKEN_DATA_KEYS = Set.new([:marketplaceId, :actorId, :role])

    class JwtAuthenticator < MiddlewareBase
      def enter(ctx)
        unless APP_CONFIG.harmony_api_disable_authentiation
          token = create_token(ctx[:opts][:auth_data])
          ctx[:req][:headers]["Authorization"] = "Token #{token}"
        end
        ctx
      end

      private

      def create_token(auth_data)
        if !auth_data || auth_data.keys.to_set != TOKEN_DATA_KEYS
          raise ArgumentError.new("Invalid authentiction data")
        end
        JWTUtils.encode(auth_data, APP_CONFIG.harmony_api_token_secret, exp: 5.minutes.from_now)
      end
    end
  end
end
