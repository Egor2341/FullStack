import pytest
from unittest.mock import AsyncMock

from services.alpha_vantage_service import ExchangeService


@pytest.mark.asyncio
async def test_get_rates_success():
    service = ExchangeService()

    service.adapter.get_rate = AsyncMock(return_value={
        "Realtime Currency Exchange Rate": {
            "5. Exchange Rate": "100.0"
        }
    })

    result = await service.get_rates()

    assert result.rates["USD"] == 100.0
    assert result.rates["EUR"] == 100.0
    assert result.rates["CNY"] == 100.0
