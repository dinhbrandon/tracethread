from django.shortcuts import render


def test(request):

    return render(request, 'index.html')

# Create your views here.
