#include <iostream>
#include <vector>
#include <cmath>
#include <ctime>
#define STB_IMAGE_IMPLEMENTATION
#include "stb/stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb/stb_image_write.h"
#include <chrono>
#include <filesystem>
#include <string>

using namespace std;

typedef struct {
    vector <string> path;
    vector <double> cosine;
} Result;

vector<vector<double>> grayscale(const vector<vector<vector<int>>>& img) {
    int rows = img.size();
    int cols = img[0].size();
    vector<vector<double>> img_gray(rows, vector<double>(cols, 0));

    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j){
            img_gray[i][j] = round(0.29 * img[i][j][0] + 0.587 * img[i][j][1] + 0.114 * img[i][j][2]);
        }
    }

    return img_gray;
}

vector<vector<double>> imagetoGray(const string& path) {
    int width, height, channels;
    unsigned char *image = stbi_load(path.c_str(), &width, &height, &channels, 0);

    if (!image) {
        cerr << "Error loading image" << endl;
        return vector<vector<double>>();
    }

    auto *temp = new vector <vector <vector <int>>>(height, vector<vector<int>>(width, vector<int>(channels, 0)));
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            int pixelIndex = (y * width + x) * channels;
            (*temp)[y][x][0] = image[pixelIndex]; // Red
            (*temp)[y][x][1] = image[pixelIndex + 1]; // Green
            (*temp)[y][x][2] = image[pixelIndex + 2]; // Blue
        }
    }
    // Convert to grayscale
    auto *img_gray = new vector <vector <double>>(height, vector<double>(width, 0));
    *img_gray = grayscale(*temp);

    return *img_gray;
}

vector<vector<double>> cooc0(const vector<vector<double>>& grayscale) {
    vector<vector<double>> cooc(256, vector<double>(256, 0));

    int row = grayscale.size();
    int col = grayscale[0].size();

    for (int i = 0; i < row; ++i) {
        for (int j = 0; j < col; ++j) {
            if (j < col - 1) {
                int baris = grayscale[i][j];
                int kolom = grayscale[i][j + 1];
                cooc[baris][kolom] += 1;
            }
        }
    }

    return cooc;
}

vector<vector<double>> transpose(const vector<vector<double>>& matrix) {
    size_t row = matrix.size();
    size_t col = matrix[0].size();
    vector<vector<double>> result(col, vector<double>(row, 0));

    for (int i = 0; i < row; ++i) {
        for (int j = 0; j < col; ++j) {
            result[j][i] = matrix[i][j];
        }
    }

    return result;
}

vector<vector<double>> symmetric(const vector<vector<double>>& cooc, const vector<vector<double>>& transpose) {
    size_t row = cooc.size();
    size_t col = cooc[0].size();
    vector<vector<double>> result(row, vector<double>(col, 0));

    for (int i = 0; i < row; ++i) {
        for (int j = 0; j < col; ++j) {
            result[i][j] = cooc[i][j] + transpose[i][j];
        }
    }

    return result;
}

double sumMatrix(vector<vector<double>> matrix) {
    double sum = 0;
    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            sum += matrix[i][j];
        }
    }
    return sum;
}

vector<vector<double>> normalize(const vector<vector<double>>& matrix) {
    double sum = sumMatrix(matrix);
    vector<vector<double>> norm(matrix.size(), vector<double>(matrix[0].size(), 0.0));

    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            norm[i][j] = static_cast<double>(matrix[i][j]) / sum;
        }
    }

    return norm;
}

double contrast(const vector<vector<double>>& matrix) {
    double hasilcontrast = 0;
    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            hasilcontrast += matrix[i][j] * pow(i - j, 2);
        }
    }
    return hasilcontrast;
}

double homogeneity(vector<vector<double>> matrix) {
    double hasilhomogeneity = 0;
    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            hasilhomogeneity += matrix[i][j] / (1 + pow(i - j, 2));
        }
    }
    return hasilhomogeneity;
}

double entropy(vector<vector<double>> matrix) {
    double hasilentropy = 0;
    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            if (matrix[i][j] > 0) {
                hasilentropy += (-1) * (matrix[i][j] * log10(matrix[i][j]));
            }
        }
    }
    return hasilentropy;
}

int absolut(int x) {
    return (x < 0) ? -x : x;
}

double dissimilarity(vector<vector<double>> matrix) {
    double hasildissimilarity = 0;
    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            if (matrix[i][j] > 0) {
                hasildissimilarity += matrix[i][j] * absolut(i - j);
            }
        }
    }
    return hasildissimilarity;
}

double asmProp(vector<vector<double>> matrix) {
    double hasilasm = 0;
    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            if (matrix[i][j] > 0) {
                hasilasm += pow(matrix[i][j], 2);
            }
        }
    }
    return hasilasm;
}

double energy(vector<vector<double>> matrix) {
    return sqrt(asmProp(matrix));
}

double correlation(vector<vector<double>> matrix) { 
    double sumi = 0;
    double sumj = 0;
    double sumMatrixVal = sumMatrix(matrix);

    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            sumi += i * matrix[i][j];
            sumj += j * matrix[i][j];
        }
    }

    double ratai = sumi / sumMatrixVal;
    double rataj = sumj / sumMatrixVal;

    double sum_temp_i = 0;
    double sum_temp_j = 0;

    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            sum_temp_i += pow(i - ratai, 2) * matrix[i][j];
            sum_temp_j += pow(j - rataj, 2) * matrix[i][j];
        }
    }

    double sd_i = sqrt(sum_temp_i / sumMatrixVal);
    double sd_j = sqrt(sum_temp_j / sumMatrixVal);

    double hasilcorrelation = 0;

    for (int i = 0; i < matrix.size(); ++i) {
        for (int j = 0; j < matrix[0].size(); ++j) {
            hasilcorrelation += matrix[i][j] * ((i - ratai) * (j - rataj) / (sd_i * sd_j));
        }
    }
    return hasilcorrelation;
}

double cosine(const vector<vector<double>>& matrix1, const vector<vector<double>>& matrix2) {
    double array1[] = {contrast(matrix1), homogeneity(matrix1), entropy(matrix1), dissimilarity(matrix1), energy(matrix1), correlation(matrix1)}; 
    double array2[] = {contrast(matrix2), homogeneity(matrix2), entropy(matrix2), dissimilarity(matrix2), energy(matrix2), correlation(matrix2)};

    double atas = 0;
    double panjangA = 0;
    double panjangB = 0;

    for (int i = 0; i < 6; ++i) {
        atas += array1[i] * array2[i];
        panjangA += pow(array1[i], 2);
        panjangB += pow(array2[i], 2);
    }

    panjangA = sqrt(panjangA);
    panjangB = sqrt(panjangB);

    double bawah = panjangA * panjangB;

    double cos = atas / bawah;
    double persenCos = cos * 100;

    return persenCos;
}


// Function to calculate GLCM
vector<vector<double>> glcm(const vector<vector<double>>& image) {
    vector<vector<double>> coocMatrix = cooc0(image);
    vector<vector<double>> transposeMatrix = transpose(coocMatrix);
    vector<vector<double>> symmetricMatrix = symmetric(coocMatrix, transposeMatrix);
    vector<vector<double>> normalizeMatrix = normalize(symmetricMatrix);
    return normalizeMatrix;
}

void queryAllImage(vector<vector<double>> glcmimage1, const string& path, Result *hasil) {
    int count = 0;
    for (auto& p : filesystem::directory_iterator(path)) {
        auto *matQuery = new vector<vector<double>>;
        auto *matQueryGLCM = new vector<vector<double>>;
        *matQuery = imagetoGray(p.path());
        *matQueryGLCM = glcm(*matQuery);
        float cos = cosine(glcmimage1, *matQueryGLCM);
        if (cos >= 60) {
            ((*hasil).path).push_back(p.path().filename());
            ((*hasil).cosine).push_back(cos);
        }
        free(matQuery);
    }
}

int binarySearch(vector<double> a, float item, int low, int high){
    if (high <= low)
        return (item < a[low]) ?
            (low + 1) : low;

    int mid = (low + high) / 2;

    if (item == a[mid])
        return mid + 1;

    if (item < a[mid])
        return binarySearch(a, item, mid + 1, high);
    return binarySearch(a, item, low, mid - 1);
}


void sortResult(Result *a) {
    int i, j, loc;
    double selected;
    for (i = 1; i < (*a).path.size(); ++i)
    {
        j = i - 1;
        selected = (*a).cosine[i];
        string selectedPath = (*a).path[i];

        loc = binarySearch((*a).cosine, selected, 0, j);

        while (j >= loc)
        {
            (*a).cosine[j + 1] = (*a).cosine[j];
            (*a).path[j + 1] = (*a).path[j];
            j--;
        }
        (*a).cosine[j + 1] = selected;
        (*a).path[j + 1] = selectedPath;
    }
}

int main() {
    auto start = chrono::high_resolution_clock::now();
    string pathcek = "/Users/shazyataufik/Documents/ITB/Semester 3/Aljabar Linier dan Geometri/Tubes 2 Algeo/tesl.png";
    string folderPath = "/Users/shazyataufik/Documents/ITB/Semester 3/Aljabar Linier dan Geometri/Tubes 2 Algeo/dataset/";
    vector<vector<double>> img1 = imagetoGray(pathcek);
    vector<vector<double>> glcmimage1 = glcm(img1);
    auto *hasil = new Result;
    queryAllImage(glcmimage1, folderPath, hasil);
    sortResult(hasil);
    for (int i = 0; i < (*hasil).path.size(); i++){
        cout << (*hasil).path[i] << ": " << (*hasil).cosine[i] << "%" << endl;
    }
    auto stop = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::milliseconds>(stop - start);
    cout << duration.count() << endl;

    return 0;
}